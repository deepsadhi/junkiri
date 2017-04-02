/** @module services/user */
var user = require('../daos/user');

/**
 * Authenticate user
 * @param  {Object}   param Parameter
 * @param  {Function} cb    Callback
 */
exports.authenticate = function(param, cb) {
  user.authenticate(param, function(row) {
    if (user) {
      cb(row);
    } else {
      cb(false)
    }
  });
};

/**
 * Find user by id
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.find = function(id, cb) {
  user.find({id: id}, '', function(rows) {
    if (rows.length === 1) {
      cb(rows.shift());
    } else {
      cb(false);
    }
  });
};

/**
 * Update password
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.updatePassword = function(id, data, cb) {
  user.update(id, data, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while updating password.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Password updated successfully.',
      });
    }
  });
};


