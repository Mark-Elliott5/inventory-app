const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/products', itemController.itemList);

router.get('/products/:id', itemController.itemDetail);

router.get('/products/create', itemController.itemCreateGet);

router.post('/products/create', itemController.itemCreatePost);

router.get('/products/:id/update', itemController.itemUpdateGet);

router.post('/products/:id/update', itemController.itemUpdatePost);

router.get('/products/:id/delete', itemController.itemDeleteGet);

router.post('/products/:id/update', itemController.itemUpdatePost);

module.exports = router;
