const express = require("express");
const ticketController = require("../../controllers/API/Admin/ticketController");

const router = express.Router();

router.get("/", ticketController.ticket_index);
router.post("/", ticketController.ticket_create_post);
router.get("/show/:id", ticketController.ticket_details);
router.delete("/:id", ticketController.ticket_delete);
router.patch("/:id", ticketController.ticket_update);
router.get("/created_by_me", ticketController.created_by_me);
router.get("/assigned_to_me", ticketController.assigned_to_me);
router.post("/assign/:ticket_id", ticketController.assign_support);
router.get("/dashboard", ticketController.dashboard);

module.exports = router;
