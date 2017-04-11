var express = require('express');
var user = require('../controllers/user');
var utils = require('../utils/common');

var router = express.Router();

/**
 * Junkiri app
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
router.get('/', function(req, res) {
  res.render('home', {
    title: 'Junkiri'
  });
});

/**
 * Login page
 * @param  {Object}   req Express request object
 * @param  {Object}   res Express response object
 * @return {Function}     Express view
 */
router.get('/login', function(req, res) {
  var url = utils.url(req.originalUrl);
  var username = req.session.username ? req.session.username : '';

  res.render('admin/login', {
    form: {
      action: url,
      value: {
        username: username,
      },
    },
    title: 'Junkiri: Login',
  });
});

router.post('/login', user.authenticate);

module.exports = router;
