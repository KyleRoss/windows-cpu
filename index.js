/**
 * windows-cpu module for Node.js to get various load statistics.
 * @module windows-cpu
 * @version 0.1.4
 * @author Kyle Ross <kylerross1324@gmail.com>
 * @license MIT License
 * 
 * @requires os
 * @requires child_process
 *
 * @example
 *
 * var cpu = require('windows-cpu');
 */

(function() {
    var platform = require('os').platform(),
        path     = require('path'),
        exec     = require('child_process').exec,
        execFile = require('child_process').execFile,
        wmic     = platform === 'win32'? path.join(process.env.SystemRoot, 'System32', 'wbem', 'wmic.exe') : null,
        emptyFn  = function(){},
        findLoad;
    
    /*
     * Checks current platform to ensure we are running on `win32`.
     * @private
     * @param {function} cb A callback function to call if there is an error.
     * @returns {boolean} True if `win32` platform, else false.
     */
    function checkPlatform(cb) {
        if(platform !== 'win32') {
            if(isFunction(cb)) cb(new Error('windows-cpu> [ERROR] This module only works on Windows platforms.'));
            return false;
        }
        return true;
    }
    
    /*
     * Proper checking to see if variable is a function.
     * @private
     * @param {*} fn The variable to check if is a function.
     * @returns {boolean} True if is a function, else false.
     */
    function isFunction(fn) {
        var getType = {};
        return fn && getType.toString.call(fn) === '[object Function]';
    }
    
    /**
     * Gets the total load in percent for process(es) by a specific search parameter.
     * @param {string|number} arg Specific search parameter. Can be a Process ID or Process Name.
     * @param {function} cb A callback function to handle the results (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
     *
     * // Find the total load for "chrome" processes
     * cpu.findLoad('chrome', function(error, results) {
     *      if(error) {
     *          return console.log(error);
     *      }
     *
     *      // results =>
     *      // {
     *      //    load: 8,
     *      //    found: [
     *      //        { pid: '900', process: 'chrome', load: 4 },
     *      //        { pid: '905', process: 'chrome#1', load: 0 },
     *      //        { pid: '910', process: 'chrome#2', load: 4 }
     *      //    ]
     *      // }
     *
     *      console.log('Google Chrome is currently using ' + results.load + '% of the cpu.');
     * });
     */
    findLoad = exports.findLoad = function findLoad(arg, cb) {
        if(!isFunction(cb)) cb = emptyFn;
        if(!checkPlatform(cb)) return;
        
        var cmd = "wmic path Win32_PerfFormattedData_PerfProc_Process get Name,PercentProcessorTime,IDProcess | findstr /i /c:" + arg;
        exec(cmd, function (error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            if(!res) return cb('Cannot find results for provided arg: ' + arg, { load: 0, results: [] });
            
            var found = res.replace(/[^\S\n]+/g, ':').replace(/\:\s/g, '|').split('|').filter(function(v) {
                return !!v;
            }).map(function(v) {
                var data = v.split(':');
                return {
                    pid: +data[0],
                    process: data[1],
                    load: +data[2]
                };
            });
            
            var totalLoad = 0;
            
            found.forEach(function(obj) {
                totalLoad += obj.load;
            });
            
            var output = {
                load: totalLoad,
                found: found
            };
            
            cb(null, output);
        });
    };
    
    /**
     * Gets the total load in percent for all processes running on the current machine per CPU.
     * @param {function} cb A callback function to handle the results (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
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
    exports.totalLoad = function totalLoad(cb) {
        if (!isFunction(cb)) cb = emptyFn;
        if (!checkPlatform(cb)) return;
        
        execFile(wmic, ['cpu', 'get', 'loadpercentage'], function (error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            
            var cpus = (res.match(/\d+/g) || []).map(function(x) { 
                return +(x.trim()); 
            });
            
            cb(null, cpus);
        });
    };
    
    /**
     * Gets the total load in percent for all Node.js processes running on the current machine.
     * @param {function} cb A callback function to handle the results (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
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
     *      console.log('Total Node.js Load: ' + results.load);
     * });
     */
    exports.nodeLoad = function nodeLoad(cb) {
        findLoad('node', cb);
    };
    
    /**
     * Gets the total load in percent for all processes running on the current machine per CPU.
     * @param {function} cb A callback function to handle the results (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
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
     *      console.log('Total Process Load: ' + results.load);
     * });
     */
    exports.processLoad = function processLoad(cb) {
        findLoad(process.pid, cb);
    };
    
    /**
     * Gets the name of each processor in the machine.
     * @param {function} cb A callback function to handle the results (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
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
    exports.cpuInfo = function cpuInfo(cb) {
        if(!isFunction(cb)) cb = emptyFn;
        if(!checkPlatform(cb)) return;
        
        execFile(wmic, ['cpu', 'get', 'Name'], function (error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            
            var cpus = res.match(/[^\r\n]+/g).map(function(v) {
                return v.trim();
            });
            
            cpus.shift();
            cb(null, cpus);
        });
    };

    /**
     * Gets the total memory usage value in KB , MB and GB .
     * @param {function} cb A callback function to handle the result (error, results).
     * @example
     *
     * var cpu = require('windows-cpu');
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
    exports.totalMemoryUsage = function totalMemoryUsage(cb) {
        if (!isFunction(cb)) cb = emptyFn;
        if (!checkPlatform(cb)) return;
        
        var cmd = "tasklist /FO csv /nh";
        exec(cmd, function (error, res, stderr) {
            if(error !== null || stderr) return cb(error || stderr);
            var results = { usageInKb: 0 , usageInMb: 0 , usageInGb: 0 };
            
            results.usageInKb = res.match(/[^\r\n]+/g).map(function(v) {
                var amt = +v.split('","')[4].replace(/[^\d]/g, '');
                return (!isNaN(amt) && typeof amt === 'number')? amt : 0;
            }).reduce(function(prev, current) {
                return prev + current;
            });
            
            results.usageInMb = results.usageInKb / 1024;
            results.usageInGb = results.usageInMb / 1024;
            
            cb(null, results);
        });
    };
}());
