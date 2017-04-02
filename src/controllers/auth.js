/** @module controllers/auth */

/**
 * Check user session
 * @memberof module:controllers/Auth
 * @param  {Object}   req   Express request object
 * @param  {Object}   res   Express response object
 * @param  {Function} next  Express next middleware function
 * @return {Function}       Express redirect
 */
module.exports = function(req, res, next) {
  if (!req.session.user_id) {
    req.flash('alert', 'Please login.');
    res.redirect('/login');
  } else {
    next();
  }
};
