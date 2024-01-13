const express = require('express');
const complainController = require('../../controllers/API/User/complainController');

const router = express.Router();

router.get('/', complainController.myComplains);
router.get('/show/:id', complainController.showComplain);
router.post('/', complainController.createComplain);
router.patch('/:id', complainController.updateComplain);
router.delete('/:id', complainController.deleteComplain);

module.exports = router;