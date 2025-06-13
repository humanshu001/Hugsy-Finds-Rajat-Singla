const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET all products
router.get('/', productController.getAllProducts);

// GET single product by ID
router.get('/:id', productController.getProductById);

// GET products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// POST create new product with file upload
router.post('/', upload.array('productImages', 10), productController.createProduct);

// PUT update product with file upload
router.put('/:id', upload.array('productImages', 10), productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

// PATCH update product stock
router.patch('/:id/stock', productController.updateProductStock);

module.exports = router;
