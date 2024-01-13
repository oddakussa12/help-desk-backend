const express = require('express');
const ticketController = require('../../controllers/API/User/ticketController');

const router = express.Router();

router.get('/', ticketController.created_by_me);
router.post('/', ticketController.ticket_create_post);
router.get('/show/:id', ticketController.ticket_details);
router.delete('/:id', ticketController.ticket_delete);
router.patch('/:id', ticketController.ticket_update);

module.exports = router;