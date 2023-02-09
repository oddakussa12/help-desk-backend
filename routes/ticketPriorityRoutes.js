const express = require('express');
const ticketPriorityController = require('../controllers/ticketPriorityController');

const router = express.Router();

router.get('/', ticketPriorityController.index);
router.post('/', ticketPriorityController.store);
router.delete('/:id', ticketPriorityController.destroy);
router.patch('/:id', ticketPriorityController.update);

module.exports = router;