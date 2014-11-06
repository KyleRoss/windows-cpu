/**
 * windows-cpu - Tests for windows-cpu functionality
 * @author Kyle Ross <kylerross1324@gmail.com>
 * @requires mocha
 * @requires should
 */

var should = require('should'),
    cpu;

beforeEach(function() {
    cpu = require('../');
});

describe('totalLoad function', function() {
    it('should call the callback with an array of number(s)', function(done) {
        cpu.totalLoad(function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Array;
                
                if (results.length <= 0) {
                    done('results length should be greater than 0');
                }
                
                results.forEach(function(v) {
                    v.should.be.an.Number.and.be.within(0, 100);
                });
                done();
            }
        });
    });
});

describe('nodeLoad function', function() {
    it('should call the callback with an object', function(done) {
        cpu.nodeLoad(function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Object.with.properties('load', 'found');
                
                results.load.should.be.an.Number.and.be.within(0, 100);
                results.found.should.be.an.Array;
                
                if (results.found.length <= 0) {
                    done('results.found length should be greater than 0');
                }
                
                results.found.forEach(function(v) {
                    v.should.be.an.Object.with.properties('pid', 'process', 'load');
                    v.pid.should.be.an.Number;
                    v.process.should.be.a.String.and.not.be.empty;
                    v.load.should.be.an.Number;
                });
                done();
            }
        });
    });
});

describe('processLoad function', function() {
    it('should call the callback with an object', function(done) {
        cpu.processLoad(function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Object.with.properties('load', 'found');
                
                results.load.should.be.an.Number.and.be.within(0, 100);
                results.found.should.be.an.Array;
                
                if (results.found.length <= 0) {
                    done('results.found length should be greater than 0');
                }
                
                results.found.should.have.a.lengthOf(1);
                
                results.found.forEach(function(v) {
                    v.should.be.an.Object.with.properties('pid', 'process', 'load');
                    v.pid.should.be.an.Number;
                    v.process.should.be.a.String.and.not.be.empty;
                    v.load.should.be.an.Number;
                });
                done();
            }
        });
    });
});

describe('findLoad function', function() {
    it('should call the callback with an object', function(done) {
        cpu.findLoad('system', function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Object.with.properties('load', 'found');
                
                results.load.should.be.an.Number.and.be.within(0, 100);
                results.found.should.be.an.Array;
                
                if (results.found.length <= 0) {
                    done('results.found length should be greater than 0');
                }
                
                results.found.forEach(function(v) {
                    v.should.be.an.Object.with.properties('pid', 'process', 'load');
                    v.pid.should.be.an.Number;
                    v.process.should.be.a.String.and.not.be.empty;
                    v.load.should.be.an.Number;
                });
                done();
            }
        });
    });
    
    it('should call the callback with an error', function(done) {
        cpu.findLoad('someprocess', function(error, results) {
            if (error) {
                done();
            } else {
                done('Result should have been an error.');
            }
        });
    });
});

describe('cpuInfo function', function() {
    it('should call the callback with an array', function(done) {
        cpu.cpuInfo(function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Array;
                
                if (results.length <= 0) {
                    done('results length should be greater than 0');
                }
                
                results.forEach(function(v) {
                    v.should.be.a.String.and.not.be.empty;
                });
                done();
            }
        });
    });
});

describe('totalMemoryUsage function', function() {
    it('should call the callback with an object', function(done) {
        cpu.totalMemoryUsage(function(error, results) {
            if (error) {
                done(error);
            } else {
                results.should.be.an.Object.with.properties('usageInKb', 'usageInMb' , 'usageInGb');
                
                results.usageInKb.should.be.an.Number;
                results.usageInMb.should.be.an.Number;
                results.usageInGb.should.be.an.Number;
                                
                done();
            }
        });
    });
});
