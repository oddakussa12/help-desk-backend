const express = require("express");
const faqController = require("../../controllers/API/Admin/faqController");

const router = express.Router();

router.get("/", faqController.index);
router.get("/:id", faqController.show);
router.get("/category/:category_id", faqController.faqByCategory);
router.post("/change-status/:id", faqController.changeStatus);
router.post("/", faqController.store);
router.delete("/:id", faqController.destroy);
router.patch("/:id", faqController.update);

module.exports = router;
