/** @module controllers/switch */
var config = require('../config');
var utils = require('../utils/common');
var node = require('../services/node');
var area = require('../services/area');
var floor = require('../services/floor');
var switch_ = require('../services/switch');

/**
 * List of switch
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.index = function(req, res) {
  var url = utils.url(req);
  var addUrl = url + '/create';

  area.index(function(rows) {
    var areas = rows.map(function(row) {
      return row.name;
    });

    node.index(function(rows) {
      var nodes = rows.map(function(row) {
        return row.name;
      });

      floor.index(function(rows) {
        var floors = rows.map(function(row) {
          return row.name;
        });

        switch_.index(function(rows) {
          var data = {
            url: url,
            index: rows,
            areas: areas,
            nodes: nodes,
            floors: floors,
            addUrl: addUrl,
            alive: ['Yes', 'No'],
            title: 'Junkiri: Switches',
          };

          res.render('admin/switch/index', data);
        });
      });
    });
  });
};

/**
 * Add switch form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.create = function(req, res) {
  var url = utils.url(req);
  url = url.replace('/create', '');

  area.index(function(areas) {
    node.index(function(nodes) {
      floor.index(function(floors) {
        res.render('admin/switch/form', {
          form: {
            value: {},
            option: {
              area: areas,
              node: nodes,
              floor: floors,
              pin: config.nodemcu.pins,
            },
            action: url,
            submit: 'Add',
            title: 'Add switch',
          },
          title: 'Junkiri: Create switch',
        });
      });
    });
  });
}

/**
 * Save switch
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.store = function(req, res) {
  var url = utils.url(req);

  switch_.store(req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Edit switch form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.edit = function(req, res) {
  var url = utils.url(req);

  switch_.find(req.params.id, function(value) {
    if (value === false) {
      req.flash('alert', 'Switch does not exists.');
      res.redirect(url.replace(/\/[0-9]*\/edit/g, ''));
    }
    area.index(function(areas) {
      node.index(function(nodes) {
        floor.index(function(floors) {
          res.render('admin/switch/form', {
            form: {
              value: value,
              option: {
                area: areas,
                node: nodes,
                floor: floors,
                pin: config.nodemcu.pins,
              },
              submit: 'Update',
              title: 'Edit switch',
              availablePins: config.nodemcu.pins,
              action: url.replace('/edit', '?_method=PUT'),
            },
            title: 'Junkiri: Edit switch',
          });
        });
      });
    });
  });
}

/**
 * Update switch
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.put = function(req, res) {
  var url = utils.url(req);
  url = url.replace(/\/[0-9]*\?_method=PUT/g, '');

  switch_.update(req.params.id, req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Delete switch
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.delete = function(req, res) {
  var url = utils.url(req);
  url = url.replace(/\/[0-9]*\?_method=DELETE/g, '');

  switch_.delete(req.params.id, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};
