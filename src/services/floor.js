/** @module services/floor */
var floor = require('../daos/floor');

/**
 * Check floor exists already or not
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
function floorExists(data, cb) {
  var param = {
    name: data.name,
  };

  floor.find(param, 'OR', function(rows) {
    cb(rows);
  });
}

/**
 * List of floor
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  floor.index(function(rows) {
    cb(rows);
  });
};

/**
 * Find floor by id
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.find = function(id, cb) {
  floor.find({id: id}, '', function(rows) {
    if (rows.length === 1) {
      cb(rows.shift());
    } else {
      cb(false);
    }
  });
};

/**
 * Save floor
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  floorExists(data, function(rows) {
    if (rows.length !== 0) {
      cb({
        type: 'alert',
        message: 'Floor with details already exists.',
      });
    } else {
      floor.store(data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while adding floor.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Floor added successfully.',
          });
        }
      });
    }
  });
};

/**
 * Update floor
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  floorExists(data, function(rows) {
    if ((rows.length === 1 && rows[0].id != data.id) || rows.length >= 2) {
      cb({
        type: 'alert',
        message: 'Floor with details already exists.',
      });
    } else {
      floor.update(id, data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while updating floor.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Floor updated successfully.',
          });
        }
      });
    }
  });
};

/**
 * Delete floor
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  floor.delete(id, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while deleting floor.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Floor deleted successfully.',
      });
    }
  });
};
