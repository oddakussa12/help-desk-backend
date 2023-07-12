const express = require("express");
const faqController = require("../../controllers/API/Support/faqController");

const router = express.Router();

router.get("/", faqController.created_by_me);
router.get("/show/:id", faqController.faq_detail);
router.post("/", faqController.faq_create_post);
router.patch("/:id", faqController.faq_update);
router.delete("/:id", faqController.faq_delete);

module.exports = router;
