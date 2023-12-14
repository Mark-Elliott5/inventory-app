const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/create', categoryController.categoryCreateGet);

router.post('/create', categoryController.categoryCreatePost);

router.get('/:id/update', categoryController.categoryUpdateGet);

router.post('/:id/update', categoryController.categoryUpdatePost);

router.get('/:id/delete', categoryController.categoryDeleteGet);

router.post('/:id/delete', categoryController.categoryDeletePost);

router.get('/:id', categoryController.categoryDetail);

router.get('/', categoryController.categoryList);

module.exports = router;
