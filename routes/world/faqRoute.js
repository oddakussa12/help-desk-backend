const express = require("express");
const faqController = require("../../controllers/API/World/faqController");

const router = express.Router();

router.get("/", faqController.getAllFaqs);

module.exports = router;
