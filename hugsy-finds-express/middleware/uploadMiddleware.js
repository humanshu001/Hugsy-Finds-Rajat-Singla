const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirectories = () => {
  const dirs = [
    'uploads',
    'uploads/products',
    'uploads/categories',
    'uploads/users',
    'uploads/misc'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirectories();

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Determine destination based on route or field
    let uploadPath = 'uploads';
    
    if (req.originalUrl.includes('/products')) {
      uploadPath = 'uploads/products';
    } else if (req.originalUrl.includes('/categories')) {
      uploadPath = 'uploads/categories';
    } else if (req.originalUrl.includes('/users')) {
      uploadPath = 'uploads/users';
    } else {
      uploadPath = 'uploads/misc';
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  // Accept documents only
  if (!file.originalname.match(/\.(pdf|doc|docx|txt|xls|xlsx)$/)) {
    return cb(new Error('Only document files are allowed!'), false);
  }
  cb(null, true);
};

// Create upload middleware instances
const uploadOptions = {
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
};

// Middleware for handling upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: `File too large. Maximum size is ${(uploadOptions.limits.fileSize / (1024 * 1024)).toFixed(2)}MB` 
      });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ message: err.message });
  }
  
  // Everything went fine
  next();
};

// Export different upload configurations
module.exports = {
  // For single image upload
  uploadSingleImage: (fieldName = 'image') => {
    const upload = multer({
      ...uploadOptions,
      fileFilter: imageFilter
    }).single(fieldName);
    
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }
        next();
      });
    };
  },
  
  // For multiple images upload
  uploadMultipleImages: (fieldName = 'images', maxCount = 5) => {
    const upload = multer({
      ...uploadOptions,
      fileFilter: imageFilter
    }).array(fieldName, maxCount);
    
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }
        next();
      });
    };
  },
  
  // For single document upload
  uploadSingleDocument: (fieldName = 'document') => {
    const upload = multer({
      ...uploadOptions,
      fileFilter: documentFilter
    }).single(fieldName);
    
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }
        next();
      });
    };
  },
  
  // For multiple fields with different types
  uploadFields: (fields) => {
    const upload = multer({
      ...uploadOptions
    }).fields(fields);
    
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }
        next();
      });
    };
  },
  
  // For any file type
  uploadAny: (maxCount = 10) => {
    const upload = multer({
      ...uploadOptions
    }).any();
    
    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }
        next();
      });
    };
  }
};