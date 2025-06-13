const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
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

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET single category by ID
router.get('/:id', categoryController.getCategoryById);

// POST create new category with file upload
router.post('/', upload.single('categoryImage'), categoryController.createCategory);

// PUT update category with file upload
router.put('/:id', upload.single('categoryImage'), categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

