# windows-cpu History
Changes to `windows-cpu` will be recorded in this file.

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
