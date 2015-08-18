var
  ant = require('../ant'),
  assert = require('assert');


describe('ant', function () {
  describe('loadModule', function () {
    it('should load module only by name', function (done) {
      var loaded = [];

      ant.loadModule.call(loaded, './test/support/module1')
        .then(function () {
          assert.deepEqual(loaded, ['module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it('should use ant.path', function (done) {
      var loaded = [];

      ant.path = './test/support/';

      ant.loadModule.call(loaded, 'module1')
        .then(function () {console.log(loaded);
          assert.deepEqual(loaded, ['module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it('should load module by name and entry', function (done) {
      var loaded = [];

      ant.path = './test/support/';

      ant.loadModule.call(loaded, 'module1', 'entry')
        .then(function () {
          assert.deepEqual(loaded, ['module1.entry']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it('should load module by name and entry and forward arguments', function (done) {
      var loaded = [];

      ant.path = './test/support/';

      ant.loadModule.call(loaded, 'module1', 'entry', ['.', 'arg'])
        .then(function () {
          assert.deepEqual(loaded, ['module1.entry.arg']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });
  });

  describe('load', function () {
    it('should load single simple module', function (done) {
      var loaded = [];
      var config = {
        module1: 'module1'
      };

      ant.load(config, loaded)
        .then(function () {
          assert.deepEqual(loaded, ['module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        })
    });

    it('should use this as context if none is given', function (done) {
      var loaded = [];
      var config = {
        module1: 'module1'
      };

      ant.load.call(loaded, config)
        .then(function () {
          assert.deepEqual(loaded, ['module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        })
    });

    it('should load single complex module', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'module1',
          entry: 'entry',
          arguments: ['.', 'arg']
        }
      };

      ant.load(config, loaded)
        .then(function () {
          assert.deepEqual(loaded, ['module1.entry.arg']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        })
    });

    it('should care about dependencies', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'module1',
          dependency: ['module2']
        },
        module2: 'module2'
      };

      ant.load(config, loaded)
        .then(function () {
          assert.deepEqual(loaded, ['module2', 'module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        })
    });

    it('should care about nested dependencies', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'module1',
          dependency: ['module2']
        },
        module2: {
          module: 'module2',
          dependency: ['module3']
        },
        module3: 'module3'
      };

      ant.load(config, loaded)
        .then(function () {
          assert.deepEqual(loaded, ['module3', 'module2', 'module1']);
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        })
    });

    it('should throw an error on missing dependency', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'module1',
          dependency: ['module2']
        }
      };

      ant.load(config, loaded)
        .then(function () {
          done('no error thrown');
        })
        .catch(function (error) {
          done();
        })
    });

    it('should throw an error on missing module', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'moduleNotFound'
        }
      };

      ant.load(config, loaded)
          .then(function () {
            done('no error thrown');
          })
          .catch(function (error) {
            done();
          })
    });

    it('should forward module errors', function (done) {
      var loaded = [];
      var config = {
        module1: {
          module: 'module1',
          entry: 'error'
        }
      };

      ant.load(config, loaded)
        .then(function () {
          done('no error thrown');
        })
        .catch(function (error) {
          done();
        })
    });
  });
});
