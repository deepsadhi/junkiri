/** @module services/switch */
var switch_ = require('../daos/switch');

/**
 * List of switch
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  switch_.index(function(rows) {
    cb(rows);
  });
};

/**
 * Find switch by id
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.find = function(id, cb) {
  switch_.find({id: id}, '', function(rows) {
    if (rows.length === 1) {
      cb(rows.shift());
    } else {
      cb(false);
    }
  });
};

/**
 * Save switch
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  switch_.store(data, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while adding switch.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Switch added successfully.',
      });
    }
  });
};

/**
 * Update switch
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  switch_.update(id, data, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while updating switch.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Switch updated successfully.',
      });
    }
  });
};

/**
 * Delete switch
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  switch_.delete(id, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while deleting switch.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Switch deleted successfully.',
      });
    }
  });
};
