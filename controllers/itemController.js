const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Item = require('../models/item');
const Category = require('../models/category');

const { Types } = mongoose;

const fieldValidationFunctions = [
  body('name', 'Name must be at least 4 characters.')
    .exists()
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Description must be at least 10 characters.')
    .exists()
    .trim()
    .isLength({ min: 10, max: 500 })
    .escape(),
  body('price', 'Price must be at least 0.01 and include cents.')
    .exists()
    .isFloat({ min: 0.01 })
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      return decimalPlaces === 2;
    }),
  body('numberInStock', 'Number must be a non-negative integer')
    .exists()
    .isInt({
      min: 0,
    }),
  body('category', 'Must have at least one category')
    .exists()
    .isArray({ min: 1 }),
  body('category.*').escape(),
];

const handleFormRendering = asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a Item object with escaped and trimmed data.
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
    category: req.body.category,
    _id: req.params.id ? req.params.id : undefined, // This is required, or a new ID will be assigned!
  });

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/error messages.
    // Get all categories for form.
    const allCategories = await Category.find().lean().exec();

    // Mark our selected categories as checked.
    const checkedCategories = allCategories.map((category) => ({
      ...category,
      checked: item.category.indexOf(category._id) > -1 ? 'true' : undefined,
    }));

    res.render('itemForm', {
      title: 'Create Item',
      categories: checkedCategories,
      item,
      errors: errors.array(),
    });
  } else {
    // Data from form is valid. Save item.
    if (req.params.id) {
      await Item.findByIdAndUpdate(new Types.ObjectId(req.params.id), item, {});
    } else {
      await item.save();
    }
    res.redirect(item.url);
  }
});

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of items, items in/out of stock, category counts (in parallel)
  const [itemsCount, itemsInStockCount, itemsOutOfStockCount, categoriesCount] =
    await Promise.all([
      Item.countDocuments({}).exec(),
      Item.countDocuments({ numberInStock: { $gt: 0 } }).exec(),
      Item.countDocuments({ numberInStock: { $lt: 1 } }).exec(),
      Category.countDocuments({}).exec(),
    ]);

  res.render('index', {
    title: 'Vivante Inventory App',
    itemsCount,
    itemsInStockCount,
    itemsOutOfStockCount,
    categoriesCount,
  });
});

// Display list of all items.
exports.itemList = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name price numberInStock')
    .sort({ name: 1 })
    .exec();

  res.render('itemList', { title: 'Item List', itemList: allItems });
});

// Display detail page for a specific item.
exports.itemDetail = asyncHandler(async (req, res, next) => {
  // Get details of item
  const item = await Item.findById(new Types.ObjectId(req.params.id))
    .populate('category')
    .exec();

  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('itemDetails', {
    title: item.name,
    item,
  });
});

// Display item create form on GET.
exports.itemCreateGet = asyncHandler(async (req, res, next) => {
  // Get all categories, which we can use for adding to our item.
  const allCategories = await Category.find().exec();

  res.render('itemForm', {
    title: 'Create Item',
    categories: allCategories,
    item: undefined,
    errors: false,
  });
});

// Handle item create on POST.
exports.itemCreatePost = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.
  ...fieldValidationFunctions,
  // Process request after validation and sanitization.

  handleFormRendering,
];

// Display item delete form on GET.
exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(new Types.ObjectId(req.params.id))
    .populate('category')
    .exec();

  if (item === null) {
    // No results.
    res.redirect('/products');
  }

  res.render('itemDelete', {
    title: 'Delete Item',
    item,
  });
});

// Handle item delete on POST.
exports.itemDeletePost = asyncHandler(async (req, res, next) => {
  // Assume the post has valid id (ie no validation/sanitization).

  const item = await Item.findById(new Types.ObjectId(req.params.id))
    .populate('category')
    .exec();

  if (item === null) {
    // No results.
    res.redirect('/products');
  }

  // Delete object and redirect to the list of items.
  await Item.findByIdAndDelete(new Types.ObjectId(req.params.id));
  res.redirect('/products');
});

// Display item update form on GET.
exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
  // Get item and categories for form.
  const [item, allCategories] = await Promise.all([
    Item.findById(new Types.ObjectId(req.params.id))
      .populate('category')
      .exec(),
    Category.find().lean().exec(),
  ]);

  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  // Mark our selected categories as checked.

  const checkedCategories = allCategories.map((category) => ({
    ...category,
    checked:
      item.category
        .map((cat) => cat._id.toString())
        .indexOf(category._id.toString()) > -1,
  }));

  res.render('itemForm', {
    title: 'Update Item',
    categories: checkedCategories,
    item,
    errors: false,
  });
});

// Handle item update on POST.
exports.itemUpdatePost = [
  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    next();
  },
  // Validate and sanitize fields.
  ...fieldValidationFunctions,

  // Process request after validation and sanitization.
  handleFormRendering,
];
