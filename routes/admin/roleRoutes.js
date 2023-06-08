const express = require("express");
const roleController = require("../../controllers/API/Admin/roleController");

const router = express.Router();

router.get("/", roleController.index);
router.post("/", roleController.store);
router.delete("/:id", roleController.destroy);
router.patch("/:id", roleController.update);

module.exports = router;
