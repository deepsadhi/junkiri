/** @module controllers/user */
var user = require('../services/user');
var utils = require('../utils/common');

/**
 * Authenticate user
 * @param  {Object}   req   Express request object
 * @param  {Object}   res   Express response object
 * @return {Object}         URL redirect
 */
exports.authenticate = function(req, res) {
  var url = utils.url(req);

  user.authenticate(req.body, function(user) {
    if (user === false) {
      req.session.username = req.body.username;
      req.flash('alert', 'Invalid! username/password.');
      res.redirect('back');
    } else {
      req.session.user_id = user.id;
      res.redirect(url.replace('/login', '/admin'));
    }
  });
};

/**
 * Change username / password form
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 * @return {Object}     Express view
 */
exports.changePassword = function(req, res) {
  var url = utils.url(req);
  var userId = req.session.user_id;

  user.find(userId, function(value) {
    value.pwd = '';

    res.render('admin/change_password', {
      form: {
        value: value,
        title: 'Change username / password',
        action: url + '?_method=PUT',
      },
      title: 'Junkiri: Change password',
    });
  });
}

/**
 * Update username / password
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 * @return {Object}     URL redirect
 */
exports.updatePassword = function(req, res) {
  var url = utils.url(req);
  var userId = req.session.user_id;

  url = url.replace('?_method=PUT', '');

  user.updatePassword(userId, req.body, function(alert) {
    req.flash(alert.type, alert.message);
    res.redirect(url);
  });
};

/**
 * Logout
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 * @return {Object}     URL redirect
 */
exports.logout = function(req, res) {
  delete req.session.user_id;

  res.redirect('/login');
};
