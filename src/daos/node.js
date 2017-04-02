/** @module  daos/node */
var switch_ = require('./switch');
var Database = require('../utils/database').Database;

var db = new Database();
var tableName = 'nodes';

/**
 * List of node
 * @param  {Function} cb Callback
 */
exports.index = function(cb) {
  db.findAll(tableName, function(rows) {
    rows.forEach(function(row) {
      row.pin = JSON.parse(row.pin);
    });

    cb(rows);
  });
};

/**
 * Find node
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
 * Save node
 * @param  {Object}   data Data
 * @param  {Function} cb   Callback
 */
exports.store = function(data, cb) {
  db.insert(tableName, data, function(err) {
    cb(err);
  });
};

/**
 * Update node
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
  db.findAndUpdate(tableName, param, data, function(err) {
    cb(err);
  });
};

/**
 * Delete node
 * @param  {number}   id ID
 * @param  {Function} cb Callback
 */
exports.delete = function(id, cb) {
  db.delete(tableName, id, function(err) {
    cb(err);
  });
};
