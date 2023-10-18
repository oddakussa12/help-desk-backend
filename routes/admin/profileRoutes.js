const express = require("express");
const profileController = require("../../controllers/API/Admin/profileController");

const router = express.Router();

router.get("/", profileController.show);
router.patch('/', profileController.update);
router.post('/update-password', profileController.update_password);

module.exports = router;
