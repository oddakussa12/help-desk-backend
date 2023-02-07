const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', requireAuth, authController.logout);
router.post('/refresh-token', requireAuth,  authController.refreshToken);

module.exports = router;