windows-cpu
===========

CPU monitoring utilities for Node.js apps on Windows.

## About
A small API that provides load information about any process or the system on Windows platforms. Node.js does have `os.loadavg()` although it does not work correctly in Windows. Windows-CPU is a module that uses native Windows commands to compile load information. It's a lightweight module that has no dependencies and suitable tests.

**Supported Platforms**

- Windows XP - Unknown (Need Testers)
- Windows 7 - Supported and tested
- Windows Server 2008 - Supported and tested
- Windows 8 - Supported and tested (thank you @SkyLined, @EricMcRay, @scriptnull, @UltimateBrent)

## Important Notes
This module has only been tested on a Windows 7 and 2008 Server machine. I do not have access to any other versions of Windows to test, so anyone willing to test this script on other versions and create a pull request for README.md with supported platforms, would be very helpful.

This module uses child processes to call WMIC to gather it's information, if you do not have this command available or cannot spawn child processes, this module will not be of much help to you.

## Getting Started
Install windows-cpu via NPM.

	npm install windows-cpu --save

Require windows-cpu in your own Node.js application.

	var cpu = require('windows-cpu');


----------

# Documentation
totalLoad(cb)
-------------
Gets the total load in percent for all processes running on the current machine per CPU.

	var cpu = require('windows-cpu');
	
	// Get total load on server for each CPU
	cpu.totalLoad(function(error, results) {
		if(error) {
		return console.log(error);
		}
		
		// results (single cpu in percent) =>
		// [8]
		
		// results (multi-cpu in percent) =>
		// [3, 10]
	});


**Parameters**

**cb**:  *function*,  A callback function to handle the results (error, results).

nodeLoad(cb)
------------
Gets the total load in percent for all Node.js processes running on the current machine.

	var cpu = require('windows-cpu');
	
	// Get total load for all node processes
	cpu.nodeLoad(function(error, results) {
		if(error) {
		return console.log(error);
		}
		
		// results =>
		// {
		//    load: 20,
		//    found: [
		//        { pid: 1000, process: 'node', load: 10 },
		//        { pid: 1050, process: 'node#1', load: 6 },
		//        { pid: 1100, process: 'node#2', load: 4 }
		//    ]
		// }
		
		console.log('Total Node.js Load: ' + results.load);
	});


**Parameters**

**cb**:  *function*,  A callback function to handle the results (error, results).

processLoad(cb)
---------------
Gets the total load in percent for all processes running on the current machine per CPU.

	var cpu = require('windows-cpu');
	
	// Get load for current running node process
	cpu.processLoad(function(error, results) {
		if(error) {
		return console.log(error);
		}
		
		// results =>
		// {
		//    load: 10,
		//    found: [
		//        { pid: 1000, process: 'node', load: 10 }
		//    ]
		// }
		
		console.log('Total Process Load: ' + results.load);
	});


**Parameters**

**cb**:  *function*,  A callback function to handle the results (error, results).

findLoad(arg, cb)
---------------
Gets the total load in percent for process(es) by a specific search parameter.

	var cpu = require('windows-cpu');
    
    // Find the total load for "chrome" processes
    cpu.findLoad('chrome', function(error, results) {
         if(error) {
             return console.log(error);
         }
   
         // results =>
         // {
         //    load: 8,
         //    found: [
         //        { pid: 900, process: 'chrome', load: 4 },
         //        { pid: 905, process: 'chrome#1', load: 0 },
         //        { pid: 910, process: 'chrome#2', load: 4 }
         //    ]
         // }
   
         console.log('Google Chrome is currently using ' + results.load + '% of the cpu.');
    });


**Parameters**

**arg**: *string|number*, Specific search parameter. Can be a Process ID or Process Name.

**cb**:  *function*,  A callback function to handle the results (error, results).

cpuInfo(cb)
-----------
Gets the name of each processor in the machine.

	var cpu = require('windows-cpu');
	
	// Get listing of processors
	cpu.cpuInfo(function(error, results) {
		if(error) {
		return console.log(error);
		}
		
		// results =>
		// [
		//    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz',
		//    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz'
		// ]
		
		console.log('Installed Processors: ', results);
	});


**Parameters**

**cb**:  *function*,  A callback function to handle the results (error, results).

totalMemoryUsage(cb)
--------------------    
Gets the total memory usage value in KB , MB and GB .
      
     var cpu = require('windows-cpu');
    
     // Get the memory usage 
     cpu.totalMemoryUsage(function(error, results) {
          if(error) {
              return console.log(error);
          }
    
          // results =>
          // { 
          //    usageInKb: 3236244,
          //    usageInMb: 3160.39453125,
          //    usageInGb: 3.086322784423828 
          // }
    
          console.log('Total Memory Usage: ', result);
     });

**Parameters**

**cb**:  *function*,  A callback function to handle the results (error, results).


----------

# Issues
Please post any issues you find in the issues section of this repository.

# Contributing
If you would like to contribute to windows-cpu, please make sure you follow the guidelines in CONTRIBUTING.md in this repository.

# License
Licensed under the MIT License. Please see LICENSE in this repository for more information.
