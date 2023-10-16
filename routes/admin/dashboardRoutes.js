const express = require("express");
const dashboardController = require("../../controllers/API/Admin/dashboardController");

const router = express.Router();

router.get("/user_count", dashboardController.user_count);

module.exports = router;
