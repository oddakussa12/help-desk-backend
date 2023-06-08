const express = require("express");
const issueCategoryController = require("../../controllers/API/Admin/issueCategoryController");

const router = express.Router();

router.get("/", issueCategoryController.index);
router.post("/", issueCategoryController.store);
router.delete("/:id", issueCategoryController.destroy);
router.patch("/:id", issueCategoryController.update);

module.exports = router;
