const express = require("express");
const complainController = require("../../controllers/API/Support/complainController");

const router = express.Router();

router.get("/", complainController.assignedToMe);
router.get("/show/:id", complainController.showComplain);
router.post("/", complainController.respond);
router.post("/update-status", complainController.updateStatus);

module.exports = router;
