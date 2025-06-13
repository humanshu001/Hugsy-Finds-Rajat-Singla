const Offer = require('../models/Offer');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      isActive,
      offerType,
      showOnHomepage
    } = req.query;

    // Build query
    const query = {};

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Filter by offer type
    if (offerType) {
      query.offerType = offerType;
    }

    // Filter by homepage display
    if (showOnHomepage !== undefined) {
      query.showOnHomepage = showOnHomepage === 'true';
    }

    // Execute query with pagination
    const offers = await Offer.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('applicableProducts', 'name')
      .populate('applicableCategories', 'name');

    // Get total documents
    const count = await Offer.countDocuments(query);

    res.status(200).json({
      offers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOffers: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching offers',
      error: error.message
    });
  }
};

// Get single offer
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('applicableProducts', 'name images price')
      .populate('applicableCategories', 'name');

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching offer',
      error: error.message
    });
  }
};

// Create new offer
exports.createOffer = async (req, res) => {
  try {
    // Validate applicable products if provided
    if (req.body.applicableProducts && req.body.applicableProducts.length > 0) {
      for (const productId of req.body.applicableProducts) {
        const productExists = await Product.findById(productId);
        if (!productExists) {
          return res.status(400).json({ message: `Product with ID ${productId} not found` });
        }
      }
    }

    // Validate applicable categories if provided
    if (req.body.applicableCategories && req.body.applicableCategories.length > 0) {
      for (const categoryId of req.body.applicableCategories) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          return res.status(400).json({ message: `Category with ID ${categoryId} not found` });
        }
      }
    }

    const offer = await Offer.create(req.body);

    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating offer',
      error: error.message
    });
  }
};

// Update offer
exports.updateOffer = async (req, res) => {
  try {
    // Validate applicable products if provided
    if (req.body.applicableProducts && req.body.applicableProducts.length > 0) {
      for (const productId of req.body.applicableProducts) {
        const productExists = await Product.findById(productId);
        if (!productExists) {
          return res.status(400).json({ message: `Product with ID ${productId} not found` });
        }
      }
    }

    // Validate applicable categories if provided
    if (req.body.applicableCategories && req.body.applicableCategories.length > 0) {
      for (const categoryId of req.body.applicableCategories) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          return res.status(400).json({ message: `Category with ID ${categoryId} not found` });
        }
      }
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({
      message: 'Offer updated successfully',
      offer
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating offer',
      error: error.message
    });
  }
};

// Delete offer
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting offer',
      error: error.message
    });
  }
};

// Toggle offer status
exports.toggleOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    offer.isActive = !offer.isActive;
    await offer.save();
    
    res.status(200).json({
      message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully`,
      offer
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error toggling offer status',
      error: error.message
    });
  }
};

// Get active offers
exports.getActiveOffers = async (req, res) => {
  try {
    const { homepage } = req.query;
    
    const query = {};
    
    // Only get active offers
    query.isActive = true;
    
    // Current date is between start and end dates
    const now = new Date();
    query.startDate = { $lte: now };
    query.$or = [
      { endDate: { $gte: now } },
      { endDate: null }
    ];
    
    // Filter by homepage display
    if (homepage === 'true') {
      query.showOnHomepage = true;
    }
    
    const offers = await Offer.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate('applicableProducts', 'name images price')
      .populate('applicableCategories', 'name');
    
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching active offers',
      error: error.message
    });
  }
};

// Get offers by type
exports.getOffersByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!type || !['seasonal', 'flash', 'bundle', 'clearance', 'holiday', 'promotion'].includes(type)) {
      return res.status(400).json({ message: 'Valid offer type is required' });
    }
    
    const query = {
      offerType: type,
      isActive: true
    };
    
    // Current date is between start and end dates
    const now = new Date();
    query.startDate = { $lte: now };
    query.$or = [
      { endDate: { $gte: now } },
      { endDate: null }
    ];
    
    const offers = await Offer.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate('applicableProducts', 'name images price')
      .populate('applicableCategories', 'name');
    
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching offers by type',
      error: error.message
    });
  }
};

// Get offer statistics
exports.getOfferStats = async (req, res) => {
  try {
    const totalOffers = await Offer.countDocuments();
    
    const activeOffers = await Offer.countDocuments({
      isActive: true,
      startDate: { $lte: new Date() },
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    });
    
    const upcomingOffers = await Offer.countDocuments({
      startDate: { $gt: new Date() }
    });
    
    const expiredOffers = await Offer.countDocuments({
      endDate: { $lt: new Date() }
    });
    
    const offerTypeCounts = await Offer.aggregate([
      {
        $group: {
          _id: '$offerType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      totalOffers,
      activeOffers,
      upcomingOffers,
      expiredOffers,
      offerTypeCounts: offerTypeCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching offer statistics',
      error: error.message
    });
  }
};
