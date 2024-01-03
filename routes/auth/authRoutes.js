const { Router } = require("express");
const authController = require("../../controllers/API/auth/authController");
const { requireAuth } = require("../../middleware/authMiddleware");

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.post("/logout", requireAuth, authController.logout);
router.post("/refresh-token",authController.refreshToken);

module.exports = router;
