# Ant.js

A Promise module loader.

## Usage

Ant.js loads modules and calls a defined constructor function based on a simple configuration.

Example:

    ant.load({
      module1: {
        module: 'module_file1',
        entry: 'function_name',
        arguments: ['argument1', 'argument2'],
        dependency: ['module2']
      },
      module2: 'module_file2'
    }, context);

### Configuration

* key: module name
* value: filename or extended configuration
  * `module`: filename
  * `entry`: alternative constructor function (sub property of `module.exports`)
  * `arguments`: an array of arguments for the constructor function
  * `dependency`: string or array that contains the module name(s) of the dependencies

### Context

Optional the second parameter of ant.load can be used to set the context for the constructor function call.

## Global Settings

### Module Path

`ant.path` can be used to defined a lookup path for modules.

### Debug Messages

Debug message can be enabled by assigning `ant.debug` the value `true`.
