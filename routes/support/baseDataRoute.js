const express = require("express");
const baseDataController = require("../../controllers/API/Support/beseDataController");

const router = express.Router();

router.get("/ticket-status", baseDataController.get_all_ticket_statues);


module.exports = router;
