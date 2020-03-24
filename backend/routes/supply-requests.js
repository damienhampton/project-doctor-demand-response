var express = require('express');
var router = express.Router();
const supplyRequestController = require('../controllers/supply-request.controller.js');
var auth = require("../security/auth.js");

// Update password
router.put('/add', auth.authenticate(), function(req, res, next) {
  supplyRequestController.add(req, res);
  res.send({status: true});
});

// Update User Profile
router.post('/update', auth.authenticate(), function(req, res, next) {
  supplyRequestController.update(req, res);
  res.send({status: true});
});

router.get('/view', auth.authenticate(), async function(req, res, next) {
  let data = await supplyRequestController.view(req, res);
  res.send({status: true, data: data});
});

router.get('/search', auth.authenticate(), async function(req, res, next) {
  let data = await supplyRequestController.search(req, res);
  res.send({status: true, data: data});
});

// Login
router.post('/delete', auth.authenticate(), function(req, res, next) {
  supplyRequestController.delete(req, res);
  res.send({status: true});
});

module.exports = router;