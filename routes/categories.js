const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/categories', categoryController.categoryList);

router.get('/categories/:id', categoryController.categoryDetail);

router.get('/categories/create', categoryController.categoryCreateGet);

router.post('/categories/create', categoryController.categoryCreatePost);

router.get('/categories/:id/update', categoryController.categoryUpdateGet);

router.post('/categories/:id/update', categoryController.categoryUpdatePost);

router.get('/categories/:id/delete', categoryController.categoryDeleteGet);

router.post('/categories/:id/update', categoryController.categoryUpdatePost);
