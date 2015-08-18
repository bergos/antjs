module.exports = function (arg1, arg2) {
  arg1 = arg1 || '';
  arg2 = arg2 || '';

  this.push('module3' + arg1 + arg2);

  return Promise.resolve();
};


module.exports.entry = function (arg1, arg2) {
  arg1 = arg1 || '';
  arg2 = arg2 || '';

  this.push('module3.entry' + arg1 + arg2);

  return Promise.resolve();
};