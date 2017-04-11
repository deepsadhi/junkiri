/** @module controllers/node */
var config = require('../../config');
var utils = require('../utils/common');
var node = require('../services/node');

/**
 * List of node
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.index = function(req, res) {
  var url = utils.url(req.originalUrl);
  var addUrl = url + '/create';

  node.index(function(rows) {
    var data = {
      url: url,
      index: rows,
      addUrl: addUrl,
      title: 'Junkiri: Nodes',
    };

    res.render('admin/node/index', data);
  });
};

/**
 * Add node form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.create = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace('/create', '');

  res.render('admin/node/form', {
    form: {
      value: {
        pin: []
      },
      action: url,
      submit: 'Add',
      title: 'Add node',
      option: {
        pin: config.nodemcu.pins,
      }
    },
    title: 'Junkiri: Create node',
  });
}

/**
 * Save node
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.store = function(req, res) {
  var url = utils.url(req.originalUrl);
  req.body.pin = JSON.stringify(req.body.pin);

  req['body']['alive'] = 0;
  node.store(req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Edit node form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.edit = function(req, res) {
  var url = utils.url(req.originalUrl);

  node.find(req.params.id, function(value) {
    if (value === false) {
      req.flash('alert', 'Node does not exists.');
      res.redirect(url.replace(/\/[0-9]*\/edit/g, ''));
    }

    res.render('admin/node/form', {
      form: {
        value: value,
        submit: 'Update',
        title: 'Edit node',
        option: {
          pin: config.nodemcu.pins,
        },
        action: url.replace('/edit', '?_method=PUT'),
      },
      title: 'Junkiri: Edit node',
    });
  });
}

/**
 * Update node
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.put = function(req, res) {
  var url = utils.url(req.originalUrl);

  req.body.pin = JSON.stringify(req.body.pin);
  url = url.replace(/\/[0-9]*\?_method=PUT/g, '');

  node.update(req.params.id, req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Delete node
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.delete = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace(/\/[0-9]*\?_method=DELETE/g, '');

  node.delete(req.params.id, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};
