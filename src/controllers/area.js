/** @module controllers/area */
var utils = require('../utils/common');
var area = require('../services/area');

/**
 * List of area
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.index = function(req, res) {
  var url = utils.url(req.originalUrl);
  var addUrl = url + '/create';

  area.index(function(rows) {
    var data = {
      url: url,
      index: rows,
      addUrl: addUrl,
      setting: 'Area',
      title: 'Junkiri: Area settings',
    };

    res.render('admin/settings/index', data);
  });
};

/**
 * Add area form
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
      title: 'Add area',
    },
    title: 'Junkiri: Create area',
  });
}

/**
 * Save area
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.store = function(req, res) {
  var url = utils.url(req.originalUrl);

  area.store(req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Edit area form
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
exports.edit = function(req, res) {
  var url = utils.url(req.originalUrl);

  area.find(req.params.id, function(value) {
    if (value === false) {
      req.flash('alert', 'Area does not exists.');
      res.redirect(url.replace(/\/[0-9]*\/edit/g, ''));
    }

    res.render('admin/settings/form', {
      form: {
        value: value,
        submit: 'Update',
        title: 'Edit area',
        action: url.replace('/edit', '?_method=PUT'),
      },
      title: 'Junkiri: Edit area',
    });
  });
}

/**
 * Update area
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.put = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace(/\/[0-9]*\?_method=PUT/g, '');

  area.update(req.params.id, req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Delete area
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express redirect
 */
exports.delete = function(req, res) {
  var url = utils.url(req.originalUrl);
  url = url.replace(/\/[0-9]*\?_method=DELETE/g, '');

  area.delete(req.params.id, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};
