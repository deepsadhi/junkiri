/** @module controllers/floor */
var utils = require('../utils/common');
var floor = require('../services/floor');

/**
 * List of floor
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.index = function(req, res) {
  var url = utils.url(req.originalUrl);
  var addUrl = url + '/create';

  floor.index(function(rows) {
    var data = {
      url: url,
      index: rows,
      addUrl: addUrl,
      setting: 'Floor',
      title: 'Junkiri: Floor settings',
    };

    res.render('admin/settings/index', data);
  });
};

/**
 * Add floor form
 * @memberof  Controller:Floor
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.create = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace('/create', '');

  res.render('admin/settings/form', {
    form: {
      action: url,
      submit: 'Add',
      title: 'Add floor',
    },
    title: 'Junkiri: Create floor',
  });
}

/**
 * Save floor
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.store = function(req, res) {
  var url = utils.url(req.originalUrl);

  floor.store(req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Edit floor form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.edit = function(req, res) {
  var url = utils.url(req.originalUrl);

  floor.find(req.params.id, function(value) {
    if (value === false) {
      req.flash('alert', 'Floor does not exists.');
      res.redirect(url.replace(/\/[0-9]*\/edit/g, ''));
    }

    res.render('admin/settings/form', {
      form: {
        value: value,
        submit: 'Update',
        title: 'Edit floor',
        action: url.replace('/edit', '?_method=PUT'),
      },
      title: 'Junkiri: Edit floor',
    });
  });
}

/**
 * Update floor
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.put = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace(/\/[0-9]*\?_method=PUT/g, '');

  floor.update(req.params.id, req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Delete floor
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.delete = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace(/\/[0-9]*\?_method=DELETE/g, '');

  floor.delete(req.params.id, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};
