const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Category = require('../models/category');
const Item = require('../models/item');

const { Types } = mongoose;

const fieldValidationFunctions = [
  body('name', 'Category name must contain at least 3 characters')
    .exists()
    .trim()
    .isLength({ min: 3, max: 60 })
    .escape(),
  body('description', 'Description must be at least 10 characters.')
    .exists()
    .trim()
    .isLength({ min: 4, max: 500 })
    .escape(),
];

const handleFormRendering = asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request .
  const errors = validationResult(req);

  // Create a category object with escaped and trimmed data
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id ? req.params.id : undefined,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values and error messages.
    res.render('categoryForm', {
      title: 'Update Category',
      category,
      errors: errors.array(),
    });
  } else if (req.params.id) {
    await Category.findByIdAndUpdate(
      new Types.ObjectId(req.params.id),
      category
    );
    res.redirect(category.url);
  } else {
    await category.save();
    // New category saved. Redirect to category detail page.
    res.redirect(category.url);
  }
});

// Display list of all Category.
exports.categoryList = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('categoryList', {
    title: 'Category List',
    categoryList: allCategories,
  });
});

// Display detail page for a specific Category.
exports.categoryDetail = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(new Types.ObjectId(req.params.id)).exec(),
    Item.find({ category: new Types.ObjectId(req.params.id) }).exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryDetails', {
    title: 'Category Detail',
    category,
    categoryItems: itemsInCategory,
  });
});

// Display Category create form on GET.
exports.categoryCreateGet = (req, res, next) => {
  res.render('categoryForm', {
    title: 'Create Category',
    category: undefined,
    errors: false,
  });
};

// Handle Category create on POST.
exports.categoryCreatePost = [
  // Validate and sanitize the name field.
  ...fieldValidationFunctions,

  // Process request after validation and sanitization.
  handleFormRendering,
];

// Display Category delete form on GET.
exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(new Types.ObjectId(req.params.id)).exec(),
    Item.find(
      { category: new Types.ObjectId(req.params.id) },
      'title summary'
    ).exec(),
  ]);
  if (category === null) {
    // No results.
    res.redirect('/category');
  }

  res.render('categoryDelete', {
    title: 'Delete Category',
    category,
    categoryItems: itemsInCategory,
  });
});

// Handle Category delete on POST.
exports.categoryDeletePost = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(new Types.ObjectId(req.params.id)).exec(),
    Item.find({ category: new Types.ObjectId(req.params.id) }).exec(),
  ]);

  if (!itemsInCategory.length === 0) {
    // Category has items. Render in same way as for GET route.
    // Doesn't allow category delete if items present
    res.render('categoryDelete', {
      title: 'Delete Category',
      category,
      categoryItems: itemsInCategory,
    });
  } else {
    // Category has no items. Delete object and redirect to the list of categories.
    await Category.findByIdAndDelete(new Types.ObjectId(req.params.id));
    res.redirect('/category');
  }
});

// Display Category update form on GET.
exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(
    new Types.ObjectId(req.params.id)
  ).exec();

  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryForm', {
    title: 'Update Category',
    category,
    errors: false,
  });
});

// Handle Category update on POST.
exports.categoryUpdatePost = [
  // Validate and sanitize the fields.
  ...fieldValidationFunctions,
  // Process request after validation and sanitization.
  handleFormRendering,
];
