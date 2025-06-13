const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      category,
      featured,
      minPrice,
      maxPrice,
      search
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured) {
      query.featured = featured === 'true';
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name');

    // Get total documents
    const count = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Validate category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find products in category
    const products = await Product.find({ category: categoryId })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name');

    // Get total documents
    const count = await Product.countDocuments({ category: categoryId });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: 'Product description is required' });
    }
    if (!req.body.price) {
      return res.status(400).json({ message: 'Product price is required' });
    }
    if (!req.body.category) {
      return res.status(400).json({ message: 'Product category is required' });
    }
    
    // Validate category exists if provided
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    // Prepare product data
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock: parseInt(req.body.stock) || 0,
      featured: req.body.featured === 'true',
      status: req.body.status || 'draft'
    };

    // Add sale price if provided
    if (req.body.salePrice) {
      productData.salePrice = parseFloat(req.body.salePrice);
    }

    // Add SKU if provided or generate one
    productData.sku = req.body.sku || `SKU-${Date.now()}`;

    // Add tags if provided
    if (req.body.tags) {
      try {
        productData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If parsing fails, try to split by comma
        productData.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
    }

    // Add images if uploaded
    if (req.files && req.files.productImages) {
      if (Array.isArray(req.files.productImages)) {
        productData.images = req.files.productImages.map(file => file.filename);
      } else {
        productData.images = [req.files.productImages.filename];
      }
    }

    const product = await Product.create(productData);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: 'Product description is required' });
    }
    if (!req.body.price) {
      return res.status(400).json({ message: 'Product price is required' });
    }
    if (!req.body.category) {
      return res.status(400).json({ message: 'Product category is required' });
    }
    
    // Validate category exists if provided
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock: parseInt(req.body.stock) || 0,
      featured: req.body.featured === 'true',
      status: req.body.status || 'draft'
    };

    // Add sale price if provided or set to null
    if (req.body.salePrice) {
      updateData.salePrice = parseFloat(req.body.salePrice);
    } else {
      updateData.salePrice = null;
    }

    // Update SKU if provided
    if (req.body.sku) {
      updateData.sku = req.body.sku;
    }

    // Add tags if provided
    if (req.body.tags) {
      try {
        updateData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If parsing fails, try to split by comma
        updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Add new images to existing ones
      updateData.images = [
        ...(product.images || []),
        ...req.files.map(file => file.filename)
      ];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(400).json({
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.stock = quantity;
    await product.save();
    
    res.status(200).json({
      message: 'Product stock updated successfully',
      product
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating product stock',
      error: error.message
    });
  }
};

// Toggle product featured status
exports.toggleProductFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.featured = !product.featured;
    await product.save();
    
    res.status(200).json({
      message: `Product ${product.featured ? 'marked as featured' : 'removed from featured'} successfully`,
      product
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error toggling product featured status',
      error: error.message
    });
  }
};


