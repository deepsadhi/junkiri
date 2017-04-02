/** @module services/node */
var node = require('../daos/node');

/**
 * Check node exists already or not
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
function nodeExists(data, cb) {
  var param = {
    ip: data.ip,
    mac: data.mac,
    name: data.name,
  };

  node.find(param, 'OR', function(rows) {
    cb(rows);
  });
}

/**
 * List of node
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  node.index(function(rows) {
    cb(rows);
  });
};

/**
 * Find node by id
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.find = function(id, cb) {
  node.find({id: id}, '', function(rows) {
    if (rows.length === 1) {
      cb(rows.shift());
    } else {
      cb(false);
    }
  });
};

/**
 * Save node
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  nodeExists(data, function(rows) {
    if ((rows.length === 1 && rows[0].id != data.id) || rows.length >= 2) {
      cb({
        type: 'alert',
        message: 'Node with details already exists.',
      });
    } else {
      node.store(data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while adding node.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Node added successfully.',
          });
        }
      });
    }
  });
};

/**
 * Update node
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  nodeExists(data, function(rows) {
    if (rows.length >= 2) {
      cb({
        type: 'alert',
        message: 'Node with details already exists.',
      });
    } else {
      node.update(id, data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while updating node.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Node updated successfully.',
          });
        }
      });
    }
  });
};

/**
 * Delete node
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  node.delete(id, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while deleting node.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Node deleted successfully.',
      });
    }
  });
};
