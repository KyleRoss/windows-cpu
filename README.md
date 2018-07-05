# windows-cpu

[![NPM Downloads](https://img.shields.io/npm/v/windows-cpu.svg?style=for-the-badge)](https://www.npmjs.com/package/windows-cpu) [![NPM Downloads](https://img.shields.io/npm/dt/windows-cpu.svg?style=for-the-badge)](https://www.npmjs.com/package/windows-cpu) [![GitHub stars](https://img.shields.io/github/stars/KyleRoss/windows-cpu.svg?style=for-the-badge)](https://github.com/KyleRoss/windows-cpu/stargazers) [![GitHub issues](https://img.shields.io/github/issues/KyleRoss/windows-cpu.svg?style=for-the-badge)](https://github.com/KyleRoss/windows-cpu/issues) [![GitHub license](https://img.shields.io/github/license/KyleRoss/windows-cpu.svg?style=for-the-badge)](https://github.com/KyleRoss/windows-cpu/blob/master/LICENSE) [![AppVeyor tests](https://img.shields.io/appveyor/tests/KyleRoss/windows-cpu/master.svg?style=for-the-badge)](https://ci.appveyor.com/project/KyleRoss/windows-cpu/branch/master)


CPU monitoring utilities for Node.js apps on Windows.

##### NOTE: Version 1.0.0+ only supports Node v8+. If you need to support an older version of Node, install `windows-cpu@0.1.6` - See [version 0.1.6](https://github.com/KyleRoss/windows-cpu/tree/legacy).

## About
A small API that provides load information about any process or the system on Windows platforms. Node.js does have `os.loadavg()` although it does not work correctly in Windows. Windows-CPU is a module that uses native Windows commands to compile load information. It's a lightweight module that has only one dependency and suitable tests.

**Supported Platforms**

| Windows Version     | Supported? | Notes                                                     |
|---------------------|------------|-----------------------------------------------------------|
| XP Home             | No         | Does not have `wmic`. Thanks @inexist3nce                 |
| XP Professional     | Yes        | Thanks @inexist3nce                                       |
| Windows 7           | Yes        |                                                           |
| Windows Server 2008 | Yes        |                                                           |
| Windows 8           | Yes        | Thanks @SkyLined, @EricMcRay, @scriptnull, @UltimateBrent |
| Windows 10          | Yes        | Thanks @inexist3nce                                       |

## Important Notes
This module has only been tested on a Windows 7 and 2008 Server machine. I do not have access to any other versions of Windows to test, so anyone willing to test this script on other versions and create a pull request for README.md with supported platforms, would be very helpful.

This module uses child processes to call WMIC to gather it's information, if you do not have this command available or cannot spawn child processes, this module will not be of much help to you.

## Getting Started
Install windows-cpu via NPM.

```bash
npm install windows-cpu --save
```

Require windows-cpu in your own Node.js application.

```js
const cpu = require('windows-cpu');
```

----------

# API Documentation
When requiring `windows-cpu`, you are returned an isntance of the `WindowsCPU` class. To get access to the constructor to create your own instance, you may do:

```js
const WindowsCPU = require('windows-cpu').WindowsCPU;
const cpu = new WindowsCPU();
// ...
```

## Properties
#### wmic _{String}_
Path to `wmic` executable. Allows overriding the path to the executable for all `wmic` commands. Default: `${process.env.SystemRoot}\System32\wbem\wmic.exe`

**Example:**
```js
const cpu = require('windows-cpu');
const path = require('path');

cpu.wmic = path.join('/Windows', 'path', 'to', 'wmic.exe');
// => C:\Windows\path\to\wmic.exe
```

## Methods

#### isSupported()
Checks if the current system supports WindowsCPU. It checks to ensure the platform is `win32` and that WMIC exists on the system.

**Example:**
```js
if(!cpu.isSupported()) {
    throw new Error('windows-cpu is not supported on this platform');
}
```

###### Returns: _Boolean_
> `true` if system is supported, otherwise `false`.

#### totalLoad()
Gets the total CPU load of the system for each physical CPU.

**Example:**
```js
// Promise
cpu.totalLoad().then(load => {
    console.log(load);
    // Single CPU example:
    // => [10]
    // Multi-CPU example:
    // => [10, 5]
});

// async/await
let load = await cpu.totalLoad();
console.log(load);
// => [10]
```

###### Returns: _Promise[Array]_
> Resolves with an array of load percentages for each core of the processor.

#### findLoad([process])
Gets the load of all processes running on the machine or the load of a specific process if `process` is provided. The parameter `process` may be a string (process name) or number (process ID) to get the load for.

**Example:**
```js
// Without process parameter
cpu.findLoad().then(({ load, found }) => {
    console.log(load);
    // => [40]
    console.log(found);
    /* =>
        [{
            pid: 12345,
            process: 'Chrome',
            load: 1
        }, ...]
    */
});

// With process parameter
cpu.findLoad('Chrome').then(({ load, found }) => {
    console.log(load);
    // => [1]
    console.log(found);
    /* =>
        [{
            pid: 12345,
            process: 'Chrome',
            load: 1
        }]
    */
});

// async/await
let { load, found } = await cpu.findLoad('Chrome');
console.log(load);
console.log(found);
```

###### Returns: _Promise[Object]_
> Resolves with an object containing `load` (Numeric total percent the process(es) load) and `found` (array of objects containing `pid` - process id, `process` - process name, `load` - the load percent of this process).

#### nodeLoad()
Shortcut for calling `cpu.findLoad('node')`. This will return the current load for all `node` processes running on the system.

**Example:**
```js
// Promise
cpu.nodeLoad().then(({ load, found }) => {
    console.log(load);
    // => [0]
    console.log(found);
    /* =>
        [{
            pid: 12345,
            process: 'node',
            load: 0
        }]
    */
});

// async/await
let { load, found } = await cpu.nodeLoad();
console.log(load);
console.log(found);
```

###### Returns: _Promise[Object]_
> Resolves with the same information as `findLoad()`.

#### thisLoad()
Shortcut for calling `cpu.findLoad(process.pid)`. This will return the load for the current node process running.

**Example:**
```js
// Promise
cpu.thisLoad().then(({ load, found }) => {
    console.log(load);
    // => [0]
    console.log(found);
    /* =>
        [{
            pid: 12345,
            process: 'node',
            load: 0
        }]
    */
});

// async/await
let { load, found } = await cpu.thisLoad();
console.log(load);
console.log(found);
```

###### Returns: _Promise[Object]_
> Resolves with the same information as `findLoad()`.

#### cpuInfo()
Gets a list of all CPUs installed in the machine.

**Example:**
```js
// Promise
cpu.cpuInfo().then(cpus => {
    console.log(cpus);
    /* =>
        [
            'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz',
            'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz'
        ]
    */
});

// async/await
let cpus = await cpu.cpuInfo();
console.log(cpus);
```

###### Returns: _Promise[Array]_
> Resolves with array of CPU(s).

#### totalMemoryUsage()
Gets the total memory usage for the system in multiple formats.

**Example:**
```js
// Promise
cpu.totalMemoryUsage().then(mem => {
    console.log(mem);
    /* =>
        {
            usageInKb: 3236244,
            usageInMb: 3160.39453125,
            usageInGb: 3.086322784423828 
        }
    */
});

// async/await
let mem = cpu.totalMemoryUsage();
console.log(mem);
```

###### Returns: _Promise[Object]_
> Resolves with object containing keys: `usageInKb` (total in KB), `usageInMb` (total in MB), and `usageInGb` (total in GB).

----------

## Issues
Please post any issues you find in the issues section of this repository.

## Contributing
If you would like to contribute to windows-cpu, please make sure you follow the guidelines in CONTRIBUTING.md in this repository.

## License
Licensed under the MIT License. Please see LICENSE in this repository for more information.
