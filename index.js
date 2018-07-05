/**
 * windows-cpu module for Node.js to get various load statistics.
 * @module windows-cpu
 * @author Kyle Ross
 * @license MIT License
 */
"use strict";

const fs = require('fs');
const path = require('path');
const util = require('util');
const cp = require('child_process');
const platform = require('os').platform();

const exec = util.promisify(cp.exec);
const execFile = util.promisify(cp.execFile);

/**
 * @class Public class for WindowsCPU
 */
class WindowsCPU {
    constructor() {
        /**
         * Access to uninstantiated WindowsCPU class
         * @type {Class}
         */
        this.WindowsCPU = WindowsCPU;
        /**
         * Path the `wmic` executable
         * @type {String}
        */
        this.wmic = path.join(process.env.SystemRoot || '/', 'System32', 'wbem', 'wmic.exe');
    }
    
    /**
     * Checks if the current platform is supported by windows-cpu
     * @return {Boolean} Returns `true` if platform is supported, otherwise `false`.
     */
    isSupported() {
        if(platform !== 'win32') return false;
        
        try {
            fs.accessSync(this.wmic);
        } catch(e) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Gets the total load in percent for all processes running on the current machine per CPU.
     * @async
     * @return {Promise<Array>} 
     */
    async totalLoad() {
        let { stdout, stderr } = await execFile(this.wmic, ['cpu', 'get', 'loadpercentage']).catch(e => { throw e; });
        if(stderr) throw new Error(stderr);
        
        return (stdout.match(/\d+/g) || []).map(x => +(x.trim()));
    }
    
    /**
     * Finds the current processor load for all processes or a specific process name or id.
     * @async
     * @param  {?String}   arg  Optional process name or id to lookup
     * @return {Promise<Object>} 
     */
    async findLoad(arg) {
        let cmd = `${this.wmic} path Win32_PerfFormattedData_PerfProc_Process get Name,PercentProcessorTime,IDProcess`;
        if(arg) cmd += ` | findstr /i /c:${this._shellEscape(arg)}`;
        
        let { stdout, stderr } = await exec(cmd).catch(e => { throw e; });
        if(stderr) throw new Error(stderr);
        if(!stdout) return { load: 0, results: [] };
        
        let found = stdout.replace(/[^\S\n]+/g, ':').replace(/:\s/g, '|').split('|')
            .filter(v => !!v)
            .map(v => {
                let [pid, proc, load] = v.split(':');
                return {
                    pid: +pid,
                    process: proc,
                    load: +load
                };
            });

        let load = found.reduce((acc, val) => acc + val.load, 0);

        return { load, found };
    }
    
    /**
     * Retrieves the current cpu load for all node processes running on the current machine
     * @async
     * @return {Promise<Object>}  
     */
    nodeLoad() {
        return this.findLoad('node');
    }
    
    /**
     * Retrieves the current cpu load for this process.
     * @async
     * @return {Promise<Object>} 
     */
    thisLoad() {
        return this.findLoad(process.pid);
    }
    
    /**
     * Gets list of all processors in the current machine.
     * @async
     * @return {Promise<Array>} 
     */
    async cpuInfo() {
        let { stdout, stderr } = await execFile(this.wmic, ['cpu', 'get', 'Name']).catch(e => { throw e; });
        if(stderr) throw new Error(stderr);
        
        let cpus = stdout.match(/[^\r\n]+/g).map(v => v.trim());
        cpus.shift();
        
        return cpus;
    }
    
    /**
     * Gets the total memory usage on the machine in KB, MB and GB.
     * @return {Promise<Object>} 
     */
    async totalMemoryUsage() {
        let results = { usageInKb: 0, usageInMb: 0, usageInGb: 0 };
        
        let { stdout, stderr } = await exec('tasklist /FO csv /nh').catch(e => { throw e; });
        if(stderr) throw new Error(stderr);
        
        results.usageInKb = stdout.match(/[^\r\n]+/g)
            .map(v => {
                let amt = +v.split('","')[4].replace(/[^\d]/g, '');
                return (!isNaN(amt) && typeof amt === 'number') ? amt : 0;
            })
            .reduce((prev, current) => prev + current);

        results.usageInMb = results.usageInKb / 1024;
        results.usageInGb = results.usageInMb / 1024;
        
        return results;
    }
    
    /**
     * Sanitizes input to prevent malicious shell injection
     * @private 
     * @param  {String} arg  The string to sanitize
     * @return {String}      The santized string
     */
    _shellEscape(arg) {
        if(typeof arg === 'number') return arg;
        return arg.split(' ')[0].replace(/[^A-Z0-9.]/ig, '');
    }
}

module.exports = new WindowsCPU();
