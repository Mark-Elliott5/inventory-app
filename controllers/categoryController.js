const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

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
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'title summary').exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryDetail', {
    title: 'Category Detail',
    category,
    categoryItems: itemsInCategory,
  });
});

// Display Category create form on GET.
exports.categoryCreateGet = (req, res, next) => {
  res.render('categoryForm', { title: 'Create Category' });
};

// Handle Category create on POST.
exports.categoryCreatePost = [
  // Validate and sanitize the name field.
  body('name', 'Category name must contain at least 4 characters')
    .trim()
    .isLength({ min: 4 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('categoryForm', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      // Check if Category with same name (case insensitive) already exists.
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  // Get details of category and all associated items (in parallel)
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'title summary').exec(),
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
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'title summary').exec(),
  ]);

  if (itemsInCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    // Doesn't allow category delete if items present
    res.render('categoryDelete', {
      title: 'Delete Category',
      category,
      categoryItems: itemsInCategory,
    });
  } else {
    // Category has no items. Delete object and redirect to the list of categories.
    await Category.findByIdAndDelete(req.body.id);
    res.redirect('/category');
  }
});

// Display Category update form on GET.
exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('categoryForm', { title: 'Update Category', category });
});

// Handle Category update on POST.
exports.categoryUpdatePost = [
  // Validate and sanitize the name field.
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data (and the old id!)
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('categoryForm', {
        title: 'Update Category',
        category,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Update the record.
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];
