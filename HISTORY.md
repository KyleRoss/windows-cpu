# windows-cpu History
Changes to `windows-cpu` will be recorded in this file.

## 1.1.0 (7/5/2018)
* **NEW:** Moved `wmic` constant to class property `cpu.wmic` to allow overriding the location of `wmic.exe` and to handle certain issues when testing on non-Windows systems.
* **FIX:** The default `wmic` path now contains a default `/` if `process.env.SystemRoot` is `undefined`. (#14)
* Removed `command-join` dependency which was used for escaping shell input in `findLoad()`. This has been replaced with a more simple solution which makes this module dependency-free again.
* Added `_shellEscape()` method that is a simple way to escape possible malicious input to the `findLoad()` method.
* Added tests for `_shellEscape()`.
* Misc. cleanup.

## 1.0.1 (5/28/2018)
* Removed OS limitation from package.json to prevent issues with installation when windows-cpu is used as an optional dependency (#13).

## 1.0.0 (5/24/2018)
* **BREAKING:** `checkPlatform()` has been renamed to `isSupported()` and is no longer called in the constructor.
* **BREAKING:** `processLoad()` has been renamed to `thisLoad()`.
* **BREAKING:** Minimum supported Node version 8.x+
* **BREAKING:** All methods that originally used callbacks now returns Promises.
* **NEW:** Now checks if `wmic.exe` exists when checking for support
* **NEW:** `findLoad()` will now return all processes and their load if no argument is provided.
* Fix command line injection vulnerability (thanks Daniel Bond)
* Refactor to ES6
* Added dependency `command-join` to assist with escaping malicious input to `findLoad()`.
* Added CI for testing new releases.

## 0.1.6 (5/28/2018)
* Removed OS limitation from package.json to prevent issues with installation when windows-cpu is used as an optional dependency (#13).

## 0.1.5 (5/24/2018)
* Added `command-join` dependency.
* Fix command line injection vulnerability - CWE-94 (thanks Daniel Bond).

## 0.1.4 (4/8/2015)
* `totalLoad` crashing when no results returned (@driedger - #6)
* Updated README to reflect Windows 8 support

## 0.1.3 (2/3/2015)
* Performance improvements for functions that call `wmic.exe` (thanks @SkyLined - #3)
    * Updated `totalLoad` function to call `wmic.exe` directly
    * Updated `cpuInfo` function to call `wmic.exe` directly
* Updated `totalMemoryUsage` function to improve performance
* Misc. clean up
* Added HISTORY.md

## 0.1.2 (10/27/2014)
* Added `totalMemoryUsage` function (@scriptnull)
    * Added tests and updated Readme

## 0.1.1 (12/16/2013)
* Minor cleanup of unused variables

## 0.1.0 (12/16/2013)
* Initial commit of windows-cpu
