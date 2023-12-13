const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

/* GET home page. */
router.get('/', itemController.index);

module.exports = router;
