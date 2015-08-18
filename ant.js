var
  _ = require('lodash');


var ant = {
  path: null
};


ant.load = function (config, context) {
  context = context || this;

  return Promise.resolve().then(function () {
    var all = _.keys(config);
    var loaded = [];

    var loadModule = function (id, config) {
      var module = _.isString(config) ? config : config.module;
      var entry = config.entry;
      var arguments = config.arguments;

      return ant.loadModule.call(context, module, entry, arguments)
        .then(function () {
          loaded.push(id);
        });
    };

    var findNext = function () {
      var rest = _.difference(all, loaded);

      var loadable = rest.filter(function (id) {
        var dependencies = _.compact(_.flatten([config[id].dependency]));
        var missing = _.difference(dependencies, loaded);

        return missing.length === 0;
      });

      if (rest.length !== 0 && loadable.length === 0) {
        reject('missing dependencies');
      }

      return loadable;
    };

    var next = function () {
      return Promise.all(findNext().map(function (id) {
        return loadModule(id, config[id]);
      })).then(function (results) {
        if (results.length === 0) {
          return Promise.resolve();
        } else {
          return next();
        }
      });
    };

    return next();
  });
};


ant.loadModule = function (module, entry, args) {
  var context = this;

  return Promise.resolve().then(function () {
    if (ant.path) {
      module = ant.path + module;
    }

    if (ant.debug) {
      console.log('loading module: ' + module);
    }

    var loadedModule;

    try {
      loadedModule = require(module);
    } catch(error) { console.log(error);
      return Promise.reject(error);
    }

    if (!entry) {
      return loadedModule.apply(context, arguments);
    } else {
      return loadedModule[entry].apply(context, args);
    }
  });
};


module.exports = ant;
