const express = require('express');
const complainController = require('../controllers/complainController');

const router = express.Router();

router.get('/', complainController.index);
router.get('/:id', complainController.show);
router.post('/', complainController.store);
router.delete('/:id', complainController.destroy);
router.patch('/:id', complainController.update);

module.exports = router;