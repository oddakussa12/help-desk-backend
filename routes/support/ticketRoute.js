const express = require("express");
const ticketController = require("../../controllers/API/Support/ticketController");

const router = express.Router();

router.get("/show/:id", ticketController.ticket_details);
router.get("/assigned_to_me", ticketController.assigned_to_me);
router.post("/reply/:ticket_id", ticketController.reply);
router.get("/dashboard", ticketController.dashboard);

module.exports = router;
