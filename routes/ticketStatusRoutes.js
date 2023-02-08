const express = require('express');
const ticketStatusController = require('../controllers/ticketStatusController');

const router = express.Router();

router.get('/', ticketStatusController.index);
router.post('/', ticketStatusController.store);
router.delete('/:id', ticketStatusController.destroy);
router.patch('/:id', ticketStatusController.update);

module.exports = router;