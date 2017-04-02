/** @module utils/database */
var path = require('path');
var config = require('../config');
var sqlite = require('sqlite3').verbose();
var logger = require('../services/logger');

/**
 * @class Database
 */
exports.Database = function() {
  var db;

  /**
   * Open database
   */
  var init = function() {
    var dbPath = path.join(
                  path.join(
                    path.join(__dirname, '..'),
                  '..'),
                 config.database.filename);

    db = new sqlite.Database(dbPath);
  };

  /**
   * Find all rows in table
   * @param  {string}   table Table name
   * @param  {Function} cb    Callback
   */
  this.findAll = function(table, cb) {
    db.all('SELECT * FROM ' + table + ' ORDER BY name ASC', function(err, rows){
      if (err) {
        logger.error(err);
      }

      cb(rows);
    });
  };

  /**
   * Find row by search parameter
   * @param  {string}   table Table name
   * @param  {Object}   param Search parameter
   * @param  {string}   op    Operand
   * @param  {Function} cb    Callback
   */
  this.find = function(table, param, op, cb) {
    var columns = Object.keys(param);
    var condition = columns.map(function(p) {
      return p + ' = ?';
    });

    var values = [];
    for (var i in param) {
      values.push(param[i]);
    }

    var sql = 'SELECT * FROM ' + table + ' WHERE ' + condition.join(' '+op+' ');
    db.all(sql, values, function(err, rows) {
      if (err) {
        logger.error(err);
      }

      cb(rows);
    });
  };

  /**
   * Insert row
   * @param  {string}   table Table name
   * @param  {Object}   data  Data
   * @param  {Function} cb    Callback
   */
  this.insert = function(table, data, cb) {
    var columns = Object.keys(data);

    var fields = columns.map(function(key) {
      return '?';
    });

    var values = [];
    for (var i in data) {
      values.push(data[i]);
    }

    var sql = 'INSERT INTO ' + table + '(' + columns.join(',') + ') '+
              'VALUES ' + '(' + fields.join(',') + ')';
    var stmt = db.prepare(sql);

    stmt.run(values, function(err) {
      if (err === null) {
        cb(false);
      } else {
        logger.error(err);
        cb(true);
      }
    });
  }

  /**
   * Update row
   * @param  {string}   table Table name
   * @param  {number}   id    ID
   * @param  {Object}   data  Data
   * @param  {Function} cb    Callback
   */
  this.update = function(table, id, data, cb) {
    var columns = Object.keys(data);
    var set = columns.map(function(p) {
      return p + ' = ?';
    });

    var values = [];
    for (var i in data) {
      values.push(data[i]);
    }
    values.push(id);

    var sql = 'UPDATE ' + table + ' SET ' + set.join(',') + ' WHERE id = ?';
    var stmt = db.prepare(sql);

    stmt.run(values, function(err) {
      if (err === null) {
        cb(false);
      } else {
        logger.error(err);
        cb(true);
      }
    });
  }

  /**
   * Find and update
   * @param  {string}   table Table name
   * @param  {Object}   param Search parameter
   * @param  {Object}   data  Data
   * @param  {Function} cb    Callback
   */
  this.findAndUpdate = function(table, param, data, cb) {
    var columns = Object.keys(param);
    var condition = columns.map(function(p) {
      return p + ' = ?';
    });

    var where = [];
    for (var i in param) {
      where.push(param[i]);
    }

    var columns = Object.keys(data);
    var set = columns.map(function(p) {
      return p + ' = ?';
    });

    var values = [];
    for (var i in data) {
      values.push(data[i]);
    }
    values = values.concat(where);

    var sql = 'UPDATE ' + table + ' SET ' + set.join(',') + ' WHERE ' +
              condition.join(' AND ');
    var stmt = db.prepare(sql);

    stmt.run(values, function(err) {
      if (err === null) {
        cb(false);
      } else {
        logger.error(err);
        cb(true);
      }
    });
  }

  /**
   * Delete row
   * @param  {string}   table Table name
   * @param  {number}   id    ID
   * @param  {Function} cb    Callback
   */
  this.delete = function(table, id, cb) {
    var sql = 'DELETE FROM ' + table + ' WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err === null) {
        cb(false);
      } else {
        logger.error(err);
        cb(true);
      }
    });
  };

  /**
   * Close database
   */
  var close = function() {
    db.close();
  }

  init();
};

