const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productController = require('../controllers/productController');
const { uploadMultipleImages } = require('../middleware/uploadMiddleware');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Get a product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Public
router.post('/',
  uploadMultipleImages('images', 5),
  [
    check('name', 'Name is required').notEmpty(),
    check('price', 'Price is required and must be a number').isNumeric(),
    check('category', 'Category is required').notEmpty()
  ],
  productController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Public
router.put('/:id',
  uploadMultipleImages('images', 5),
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Public
router.delete('/:id', productController.deleteProduct);

module.exports = router;
