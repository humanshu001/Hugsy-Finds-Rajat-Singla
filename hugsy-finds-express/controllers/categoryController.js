const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { featured } = req.query;
    
    let query = {};
    
    // Filter by featured
    if (featured) {
      query.featured = featured === 'true';
    }
    
    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .populate('parent', 'name slug');

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    
    // Validate required fields
    if (!req.body.name || !req.body.slug) {
      return res.status(400).json({ 
        message: 'Category name and slug are required fields' 
      });
    }

    // Prepare category data
    const categoryData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description || '',
      featured: req.body.featured === 'true',
      order: parseInt(req.body.order) || 0
    };

    // Add parent if provided and valid
    if (req.body.parent && req.body.parent !== 'null' && req.body.parent !== '') {
      categoryData.parent = req.body.parent;
    }

    // Add image if uploaded
    if (req.file) {
      categoryData.image = req.file.filename;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(400).json({
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.slug) {
      return res.status(400).json({ 
        message: 'Category name and slug are required fields' 
      });
    }

    // Check if name is unique if it's being updated
    const nameExists = await Category.findOne({ 
      name: req.body.name,
      _id: { $ne: req.params.id }
    });
    if (nameExists) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    // Check if slug is unique if it's being updated
    const slugExists = await Category.findOne({ 
      slug: req.body.slug,
      _id: { $ne: req.params.id }
    });
    if (slugExists) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }

    // Check if parent category exists if it's being updated
    if (req.body.parent && req.body.parent !== 'null' && req.body.parent !== '') {
      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        return res.status(400).json({ message: 'Parent category not found' });
      }
      
      // Prevent circular reference
      if (req.body.parent.toString() === req.params.id) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      featured: req.body.featured === 'true',
      order: parseInt(req.body.order) || 0
    };

    // Handle parent field
    if (req.body.parent === 'null' || req.body.parent === '') {
      updateData.parent = null;
    } else if (req.body.parent) {
      updateData.parent = req.body.parent;
    }

    // Add image if uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Category update error:', error);
    res.status(400).json({
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category has products
    const hasProducts = await Product.findOne({ category: req.params.id });
    if (hasProducts) {
      return res.status(400).json({ 
        message: 'Cannot delete category with associated products. Reassign products first.' 
      });
    }

    // Check if category has child categories
    const hasChildren = await Category.findOne({ parent: req.params.id });
    if (hasChildren) {
      return res.status(400).json({ 
        message: 'Cannot delete category with child categories. Reassign child categories first.' 
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// Get featured categories
exports.getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true })
      .sort({ order: 1 })
      .populate('parent', 'name slug');

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching featured categories',
      error: error.message
    });
  }
};

// Get products in category
exports.getProductsInCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Validate category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find products in category
    const products = await Product.find({ category: id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total documents
    const count = await Product.countDocuments({ category: id });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products in category',
      error: error.message
    });
  }
};



