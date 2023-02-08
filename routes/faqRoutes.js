const express = require('express');
const faqController = require('../controllers/faqController');

const router = express.Router();

router.get('/', faqController.index);
router.get('/:id', faqController.show);
router.post('/', faqController.store);
router.delete('/:id', faqController.destroy);
router.patch('/:id', faqController.update);

module.exports = router;