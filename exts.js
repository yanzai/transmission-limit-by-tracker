const {uuid} = require('transmission/lib/utils');
const Tr = require('transmission');

Tr.prototype.getSomeFields = function (fields, ids, callback) {
  const options = {
    arguments: {fields, ids},
    method: this.methods.torrents.get,
    tag: uuid()
  };

  if (typeof ids === 'function') {
    callback = ids;
    delete (options.arguments.ids);
  } else {
    options.arguments.ids = Array.isArray(ids) ? ids : [ids];
  }

  this.callServer(options, callback);
  return this;
};