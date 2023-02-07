const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.get('/', ticketController.ticket_index);
router.post('/', ticketController.ticket_create_post);
router.get('/:id', ticketController.ticket_details);
router.delete('/:id', ticketController.ticket_delete);
router.patch('/:id', ticketController.ticket_update);

module.exports = router;