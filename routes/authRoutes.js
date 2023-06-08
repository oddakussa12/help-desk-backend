const { Router } = require("express");
const authController = require("../controllers/authController");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.post("/api/auth/signup", authController.signup_post);
router.post("/api/auth/login", authController.login_post);
router.post("/api/auth/logout", requireAuth, authController.logout);
router.post(
  "/api/auth/refresh-token",
  requireAuth,
  authController.refreshToken
);

module.exports = router;
