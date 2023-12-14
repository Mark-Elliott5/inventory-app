const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/create', itemController.itemCreateGet);

router.post('/create', itemController.itemCreatePost);

router.get('/:id/update', itemController.itemUpdateGet);

router.post('/:id/update', itemController.itemUpdatePost);

router.get('/:id/delete', itemController.itemDeleteGet);

router.post('/:id/delete', itemController.itemDeletePost);

router.get('/:id', itemController.itemDetail);

router.get('/', itemController.itemList);

module.exports = router;
