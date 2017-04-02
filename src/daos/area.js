/** @module  daos/area */
var switch_ = require('./switch');
var Database = require('../utils/database').Database;

var db = new Database();
var tableName = 'areas';

/**
 * List of area
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  db.findAll(tableName, function(rows) {
    cb(rows);
  });
};

/**
 * Find area
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
 * Save area
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  db.insert(tableName, data, function(err) {
    cb(err);
  });
};

/**
 * Update area
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
 * Delete area
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  db.delete(tableName, id, function(err) {
    cb(err);
  });
};
