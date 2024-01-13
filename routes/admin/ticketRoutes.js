const express = require("express");
const ticketController = require("../../controllers/API/Admin/ticketController");

const router = express.Router();

router.get("/", ticketController.ticket_index);
router.post("/", ticketController.ticket_create_post);
router.get("/show/:id", ticketController.ticket_details);
router.delete("/:id", ticketController.ticket_delete);
router.patch("/:id", ticketController.ticket_update);
router.post("/assign/:ticket_id", ticketController.assign_support);

module.exports = router;
