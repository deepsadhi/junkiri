/** @module services/socket */
var node = require('../daos/node');
var utils = require('../utils/common');
var switch_ = require('../daos/switch');

/**
 * Node list
 * @param  {Function} cb Callback
 */
exports.nodes = function(cb) {
  node.index(function(rows) {
    cb(rows);
  });
};

/**
 * Switch panel
 * @param  {Function} cb Callback
 */
exports.switches = function(cb) {
  switch_.index(function(rows) {
    var switches = {};

    rows.forEach(function(row) {
      var areaSlug = utils.slugify(row.area);
      var floorSlug = utils.slugify(row.floor);

      if (!switches.hasOwnProperty(floorSlug)) {
        switches[floorSlug] = {
          area: {},
          name: row.floor,
        };
      }

      if(!switches[floorSlug]['area'].hasOwnProperty(areaSlug)) {
        switches[floorSlug]['area'][areaSlug] = {
          'switch': [],
          'name': row.area,
        };
      }

      if(switches.hasOwnProperty(floorSlug) &&
         switches[floorSlug]['area'].hasOwnProperty(areaSlug) &&
         switches[floorSlug]['area'][areaSlug].hasOwnProperty('switch')) {
          switches[floorSlug]['area'][areaSlug]['switch'].push({
            pin: row.pin,
            name: row.name,
            node: row.node,
            alive: row.alive,
            state_: row.state_,
          });
      }
    });

    cb(switches);
  });
};

/**
 * Update switch dsate
 * @param  {Object}   param Search parameter
 * @param  {Object}   data  Data
 * @param  {Function} cb    Callback
 */
exports.updateSwitchState = function(param, data, cb) {
  data.state_ = (data.state_) ? 1 : 0;

  switch_.findAndUpdate(param, data, function(err) {
  });
};

/**
 * Update node alive state
 * @param  {Object}   param Search parameter
 * @param  {Object}   data  Data
 * @param  {Function} cb    Callback
 */
exports.updateNodeAliveState = function(param, data, cb) {
  findNode(param, function(rows) {
    if (typeof(rows) === 'object' && rows.length === 1) {
      node.findAndUpdate(param, data, function() {
        cb();
      });
    }
  });
};

/**
 * Find node
 * @param  {Object}   param Search parameter
 * @param  {Function} cb    Callback
 */
function findNode(param, cb) {
  node.find(param, '', function(rows) {
    cb(rows);
  });
};

/**
 * Set node to dead
 * @param {Function} cb Callback
 */
exports.setNodeToDead = function(cb) {
  var param = {1: 1};
  var data = {alive: 0};

  node.findAndUpdate(param, data, function() {
    cb();
  });
};
