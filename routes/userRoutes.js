const express = require('express');
const userController = require('../controllers/usersController');

const router = express.Router();

router.get('/', userController.index);
router.post('/', userController.store);
router.delete('/:id', userController.destroy);
router.patch('/:id', userController.update);
router.get('/role/:role', userController.users_by_role);

module.exports = router;