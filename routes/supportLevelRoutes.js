const express = require('express');
const supportLevelController = require('../controllers/supportLevelController');

const router = express.Router();

router.get('/', supportLevelController.index);
router.post('/', supportLevelController.store);
router.delete('/:id', supportLevelController.destroy);
router.patch('/:id', supportLevelController.update);

module.exports = router;