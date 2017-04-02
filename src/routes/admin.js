var express = require('express');
var node = require('../controllers/node');
var user = require('../controllers/user');
var area = require('../controllers/area');
var floor = require('../controllers/floor');
var switch_ = require('../controllers/switch');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/admin/switches');
});

router.get('/nodes', node.index);
router.post('/nodes', node.store);
router.put('/nodes/:id', node.put);
router.get('/nodes/create', node.create);
router.delete('/nodes/:id', node.delete);
router.get('/nodes/:id/edit', node.edit);

router.get('/areas', area.index);
router.post('/areas', area.store);
router.put('/areas/:id', area.put);
router.get('/areas/create', area.create);
router.delete('/areas/:id', area.delete);
router.get('/areas/:id/edit', area.edit);

router.get('/floors', floor.index);
router.post('/floors', floor.store);
router.put('/floors/:id', floor.put);
router.get('/floors/create', floor.create);
router.delete('/floors/:id', floor.delete);
router.get('/floors/:id/edit', floor.edit);

router.get('/switches', switch_.index);
router.post('/switches', switch_.store);
router.put('/switches/:id', switch_.put);
router.get('/switches/create', switch_.create);
router.delete('/switches/:id', switch_.delete);
router.get('/switches/:id/edit', switch_.edit);

router.put('/change-password', user.updatePassword);
router.get('/change-password', user.changePassword);

router.get('/logout', user.logout);

module.exports = router;
