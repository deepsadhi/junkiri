/** @module  daos/user */
var bcrypt = require('bcrypt');
var Database = require('../utils/database').Database;

var saltRounds = 10;
var db = new Database();
var tableName = 'users';

/**
 * Authenticate user
 * @param  {Object}   param Parameter
 * @param  {Function} cb    Callback
 */
exports.authenticate = function(param, cb) {
  var newParam = {username: param.username};

  db.find(tableName, newParam, '', function(rows) {
    if (typeof(rows) === 'object' && rows.length === 1) {
      var user = rows.shift();

      bcrypt.compare(param.pwd, user.pwd, function(err, res) {
        if (res === true) {
          cb(user);
          delete user.pwd;
        } else {
          cb(false)
        }
      });
    } else {
      cb(false);
    }
  });
}

/**
 * Find user
 * @param  {Object}   param Search parameter
 * @param  {string}   op    Operand
 * @param  {Function} cb    Callback
 */
exports.find = function(param, op, cb) {
  db.find(tableName, param, op, function(rows) {
    cb(rows);
  });
};

/**
 * Update user
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  bcrypt.hash(data.pwd, saltRounds, function(err, hash) {
    data.pwd = hash;
    db.update(tableName, id, data, function(err) {
      cb(err);
    });
  });
};
