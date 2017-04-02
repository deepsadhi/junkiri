/** @module  daos/floor */
var switch_ = require('./switch');
var Database = require('../utils/database').Database;

var db = new Database();
var tableName = 'floors';

/**
 * List of floor
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  db.findAll(tableName, function(rows) {
    cb(rows);
  });
};

/**
 * Find floor
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
 * Save floor
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  db.insert(tableName, data, function(err) {
    cb(err);
  });
};

/**
 * Update floor
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
 * Delete floor
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  db.delete(tableName, id, function(err) {
    cb(err);
  });
};
