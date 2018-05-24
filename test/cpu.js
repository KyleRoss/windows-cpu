/**
 * windows-cpu - Tests for windows-cpu functionality
 * @author Kyle Ross
 * @requires mocha
 * @requires chai
 */

const assert = require('chai').assert;
const cpu = require('../');

describe('Module', () => {
    describe('Export', () => {
        it('should export instance of WindowsCPU', () => {
            assert.instanceOf(cpu, cpu.WindowsCPU);
        });
        
        it('should have access to uninstantiated class', () => {
            assert.isOk(cpu.WindowsCPU);
        });
    });
    
    describe('WindowsCPU', () => {
        describe('isSupported()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.isSupported);
            });
            
            it('should return boolean', () => {
                let support = cpu.isSupported();
                assert.isBoolean(support);
            });
        });
        
        describe('totalLoad()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.totalLoad);
            });
            
            it('should return Promise that resolves with an array', (done) => {
                let result = cpu.totalLoad();
                
                assert.instanceOf(result, Promise);
                result.then((res) => {
                    assert.isArray(res);
                    done();
                });
            });
        });
        
        describe('findLoad()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.findLoad);
            });

            it('should return Promise that resolves with an Object (without argument)', (done) => {
                let result = cpu.findLoad();

                assert.instanceOf(result, Promise);
                result.then((res) => {
                    assert.isObject(res);
                    assert.hasAllKeys(res, ['load', 'found']);
                    assert.isAbove(res.load.length, 0);
                    assert.isAbove(res.found.length, 0);
                    done();
                });
            });
            
            it('should return Promise that resolves with an Object (with argument)', (done) => {
                let result = cpu.findLoad('node');

                assert.instanceOf(result, Promise);
                result.then((res) => {
                    assert.isObject(res);
                    assert.hasAllKeys(res, ['load', 'found']);
                    assert.isAbove(res.load.length, 0);
                    assert.isAbove(res.found.length, 0);
                    done();
                });
            });
        });
        
        describe('nodeLoad()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.nodeLoad);
            });
            
            it('should return a Promise', () => {
                assert.instanceOf(cpu.nodeLoad(), Promise);
            });
        });
        
        describe('thisLoad()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.thisLoad);
            });

            it('should return a Promise', () => {
                assert.instanceOf(cpu.thisLoad(), Promise);
            });
        });
        
        describe('cpuInfo()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.cpuInfo);
            });

            it('should return a Promise that resolves with an array', (done) => {
                let result = cpu.cpuInfo();
                
                assert.instanceOf(result, Promise);
                result.then(res => {
                    assert.isArray(res);
                    assert.isAbove(res.length, 0);
                    done();
                });
            });
        });
        
        describe('totalMemoryUsage()', () => {
            it('should be a function', () => {
                assert.isFunction(cpu.totalMemoryUsage);
            });

            it('should return a Promise that resolves with an object', (done) => {
                let result = cpu.totalMemoryUsage();

                assert.instanceOf(result, Promise);
                result.then(res => {
                    assert.isObject(res);
                    assert.hasAllKeys(res, ['usageInKb', 'usageInMb', 'usageInGb']);
                    done();
                });
            });
        });
    });
});
