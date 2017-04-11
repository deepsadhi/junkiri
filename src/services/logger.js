/** @module services/logger */
var path = require('path');
var winston = require('winston');
var config = require('../../config');

var filename =  path.join(
                  path.join(
                    path.join(
                      path.join(__dirname, '..'),
                    '..'),
                  'logs'),
                 config.database.filename);
module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: filename}),
  ]
});
