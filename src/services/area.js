/** @module services/area */
var area = require('../daos/area');

/**
 * Check area exists already or not
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
function areaExists(data, cb) {
  var param = {
    name: data.name,
  };

  area.find(param, 'OR', function(rows) {
    cb(rows);
  });
}

/**
 * List of area
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  area.index(function(rows) {
    cb(rows);
  });
};

/**
 * Find area by id
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.find = function(id, cb) {
  area.find({id: id}, '', function(rows) {
    if (rows.length === 1) {
      cb(rows.shift());
    } else {
      cb(false);
    }
  });
};

/**
 * Save area
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  areaExists(data, function(rows) {
    if (rows.length !== 0) {
      cb({
        type: 'alert',
        message: 'Area with details already exists.',
      });
    } else {
      area.store(data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while adding area.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Area added successfully.',
          });
        }
      });
    }
  });
};

/**
 * Update area
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  areaExists(data, function(rows) {
    if ((rows.length === 1 && rows[0].id != data.id) || rows.length >= 2) {
      cb({
        type: 'alert',
        message: 'Area with details already exists.',
      });
    } else {
      area.update(id, data, function(err) {
        if (err) {
          cb({
            type: 'alert',
            message: 'Error! while updating area.',
          });
        } else {
          cb({
            type: 'success',
            message: 'Area updated successfully.',
          });
        }
      });
    }
  });
};

/**
 * Delete area
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  area.delete(id, function(err) {
    if (err) {
      cb({
        type: 'alert',
        message: 'Error! while deleting area.',
      });
    } else {
      cb({
        type: 'success',
        message: 'Area deleted successfully.',
      });
    }
  });
};
