const express = require("express");
const dashboardController = require("../../controllers/API/Admin/dashboardController");

const router = express.Router();

router.get("/user_count", dashboardController.user_count);
router.get("/ticket_count", dashboardController.getTicketStatusCounts);
router.get("/support_performance", dashboardController.supportPerformance);

module.exports = router;
