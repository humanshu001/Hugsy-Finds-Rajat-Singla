const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { uploadSingleImage } = require('../middleware/uploadMiddleware');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getCategories);

// @route   GET /api/categories/:id
// @desc    Get a category by ID
// @access  Public
router.get('/:id', categoryController.getCategoryById);

// @route   POST /api/categories
// @desc    Create a new category
// @access  Public
router.post('/',
  uploadSingleImage('image'),
  [
    check('name', 'Name is required').notEmpty()
  ],
  categoryController.createCategory
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Public
router.put('/:id',
  uploadSingleImage('image'),
  categoryController.updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Public
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
