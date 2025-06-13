const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// GET all offers
router.get('/', offerController.getAllOffers);

// GET single offer by ID
router.get('/:id', offerController.getOfferById);

// POST create new offer
router.post('/', offerController.createOffer);

// PUT update offer
router.put('/:id', offerController.updateOffer);

// DELETE offer
router.delete('/:id', offerController.deleteOffer);

// PATCH toggle offer status
router.patch('/:id/toggle', offerController.toggleOfferStatus);

// GET active offers
router.get('/active/current', offerController.getActiveOffers);

// GET offers by type
router.get('/type/:type', offerController.getOffersByType);

// GET offer statistics
router.get('/stats/summary', offerController.getOfferStats);

module.exports = router;