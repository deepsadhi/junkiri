/** @module  daos/switch */
var nodes = require('./node');
var Database = require('../utils/database').Database;

var db = new Database();
var tableName = 'switches';

/**
 * List of switch
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  db.findAll('switch_panel', function(rows) {
    cb(rows);
  });
};

/**
 * List of switch with node, floor name
 * @param  {Function} cb Callback
 */
exports.list = function(cb) {
  db.findAll(tableName, function(rows) {
    cb(rows);
  });
};

/**
 * Find switch
 * @param  {string}   param Search parameter
 * @param  {string}   op    Operand
 * @param  {Function} cb    Callback
 */
exports.find = function(param, op, cb) {
  db.find(tableName, param, op, function(rows) {
    cb(rows);
  });
};

/**
 * Save switch
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  db.insert(tableName, data, function(err) {
    cb(err);
  });
};

/**
 * Update switch
 * @param  {number}   id   ID
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.update = function(id, data, cb) {
  db.update(tableName, id, data, function(err) {
    cb(err);
  });
};

/**
 * Find and update node
 * @param  {Object}   param Search parameter
 * @param  {Object}   data  Data
 * @param  {Function} cb    Callback
 */
exports.findAndUpdate = function(param, data, cb) {
  nodes.find({name: param.node}, '', function(rows) {
    if (typeof(rows) === 'object' && rows.length === 1) {
      var newParam = {
        pin: param.pin,
        node_id: rows[0].id,
      };

      db.findAndUpdate(tableName, newParam, data, function(err) {
        cb(err);
      });
    } else {
      cb(true);
    }
  });
};

/**
 * Delete switch
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  db.delete(tableName, id, function(err) {
    cb(err);
  });
};
