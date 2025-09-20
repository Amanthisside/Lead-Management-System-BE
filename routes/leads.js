const express = require('express');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../controllers/authMiddleware');

const router = express.Router();

// All lead routes require authentication
router.post('/', authMiddleware, leadController.createLead);
router.get('/', authMiddleware, leadController.getLeads);
router.get('/:id', authMiddleware, leadController.getLead);
router.put('/:id', authMiddleware, leadController.updateLead);
router.delete('/:id', authMiddleware, leadController.deleteLead);

module.exports = router;
