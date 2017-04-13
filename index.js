/**
 * windows-cpu module for Node.js to get various load statistics.
 * @module windows-cpu
 * @version 1.0.0
 * @author Kyle Ross
 * @license MIT License
 */
"use strict";

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const platform = require('os').platform();

const exec = cp.exec;
const execFile = cp.execFile;
const wmic = path.join(process.env.SystemRoot, 'System32', 'wbem', 'wmic.exe');

/**
 * Finds the current processor load of a specific process name or id.
 * @private
 * @param  {String}   arg Process name or id to lookup
 * @param  {Function} cb  Callback to call with results
 */
function findLoad(arg, cb) {
    let cmd = `wmic path Win32_PerfFormattedData_PerfProc_Process get Name,PercentProcessorTime,IDProcess | findstr /i /c:${arg}`;
    
    exec(cmd, function(error, res, stderr) {
        if(error !== null || stderr) return cb(error || stderr);
        if(!res) return cb(`Cannot find results for provided arg: ${arg}`, { load: 0, results: [] });
        
        let found = res.replace(/[^\S\n]+/g, ':').replace(/:\s/g, '|').split('|').filter(function(v) {
            return !!v;
        }).map(function(v) {
            let [pid, proc, load] = v.split(':');
            return {
                pid: +pid,
                process: proc,
                load: +load
            };
        });
        
        let load = found.reduce((acc, val) => {
            return acc + val.load;
        }, 0);
        
        cb(null, { load, found });
    });
}

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
        this.checkPlatform();
    }
    
    /**
     * Checks if the current platform is supported by windows-cpu
     * @return {Boolean} Returns `true` if platform is supported
     * @throws {Error} If platform is not Windows
     * @throws {Error} If wmic.exe process does not exist or cannot be accessed
     */
    checkPlatform() {
        if(platform !== 'win32') 
            throw new Error('windows-cpu only works on Windows platforms.');
        
        try {
            fs.accessSync(wmic);
        } catch(e) {
            throw new Error('windows-cpu is not supported on your version of Windows or you are not running as administrator.');
        }
        
        return true;
    }
    
    /**
     * Gets the total load in percent for all processes running on the current machine per CPU.
     * @param  {Function} cb Callback to call with results (error, results)
     * @return {WindowsCPU}  Instance of the WindowsCPU class
     * @example
     *
     * const cpu = require('windows-cpu');
     *
     * // Get total load on server for each CPU
     * cpu.totalLoad(function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results (single cpu in percent) =>
     *      // [8]
     *
     *      // results (multi-cpu in percent) =>
     *      // [3, 10]
     * });
     */
    totalLoad(cb) {
        execFile(wmic, ['cpu', 'get', 'loadpercentage'], function(error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            
            let cpus = (res.match(/\d+/g) || []).map(function(x) { 
                return +(x.trim()); 
            });
            
            cb(null, cpus);
        });
        
        return this;
    }
    
    /**
     * Retrieves the current cpu load for all node processes running on the current machine
     * @param  {Function} cb Callback to call with results (error, results)
     * @return {WindowsCPU}  Instance of the WindowsCPU class
     * @example
     *
     * const cpu = require('windows-cpu');
     *
     * // Get total load for all node processes
     * cpu.nodeLoad(function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results =>
     *      // {
     *      //    load: 20,
     *      //    found: [
     *      //        { pid: '1000', process: 'node', load: 10 },
     *      //        { pid: '1050', process: 'node#1', load: 6 },
     *      //        { pid: '1100', process: 'node#2', load: 4 }
     *      //    ]
     *      // }
     *
     *      console.log(`Total Node.js Load: ${results.load}%`);
     * });
     */
    nodeLoad(cb) {
        findLoad('node', cb);
        return this;
    }
    
    /**
     * Retrieves the current cpu load for this process.
     * @param  {Function} cb Callback to call with results (error, results)
     * @return {WindowsCPU}  Instance of the WindowsCPU class
     * @example
     *
     * const cpu = require('windows-cpu');
     *
     * // Get load for current running node process
     * cpu.processLoad(function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results =>
     *      // {
     *      //    load: 10,
     *      //    found: [
     *      //        { pid: '1000', process: 'node', load: 10 }
     *      //    ]
     *      // }
     *
     *      console.log(`Total Process Load: ${results.load}%`);
     * });
     */
    processLoad(cb) {
        findLoad(process.pid, cb);
        return this;
    }
    
    /**
     * Gets list of all processors in the current machine.
     * @param  {Function} cb Callback to call with results (error, results)
     * @return {WindowsCPU}  Instance of the WindowsCPU class
     * @example
     *
     * const cpu = require('windows-cpu');
     *
     * // Get listing of processors
     * cpu.cpuInfo(function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results =>
     *      // [
     *      //    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz',
     *      //    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz'
     *      // ]
     *
     *      console.log('Installed Processors: ', results);
     * });
     */
    cpuInfo(cb) {
        execFile(wmic, ['cpu', 'get', 'Name'], function(error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            
            let cpus = res.match(/[^\r\n]+/g).map(function(v) {
                return v.trim();
            });
            
            cpus.shift();
            cb(null, cpus);
        });
        
        return this;
    }
    
    /**
     * Gets the total memory usage on the machine in KB, MB and GB.
     * @param  {Function} cb Callback to call with results (error, results)
     * @return {WindowsCPU}  Instance of the WindowsCPU class
     * @example
     *
     * const cpu = require('windows-cpu');
     *
     * // Get the memory usage
     * cpu.totalMemoryUsage(function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results =>
     *      // { 
     *      //    usageInKb: 3236244,
     *      //    usageInMb: 3160.39453125,
     *      //    usageInGb: 3.086322784423828 
     *      // }
     *
     *      console.log('Total Memory Usage: ', result);
     * });
     */
    totalMemoryUsage(cb) {
        let cmd = 'tasklist /FO csv /nh';
        exec(cmd, function(error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            let results = { usageInKb: 0 , usageInMb: 0 , usageInGb: 0 };
            
            results.usageInKb = res.match(/[^\r\n]+/g).map(function(v) {
                let amt = +v.split('","')[4].replace(/[^\d]/g, '');
                return (!isNaN(amt) && typeof amt === 'number')? amt : 0;
            }).reduce(function(prev, current) {
                return prev + current;
            });
            
            results.usageInMb = results.usageInKb / 1024;
            results.usageInGb = results.usageInMb / 1024;
            
            cb(null, results);
        });
        
        return this;
    }
}

module.exports = new WindowsCPU();
