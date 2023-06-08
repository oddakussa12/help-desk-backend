const express = require("express");
const userController = require("../../controllers/API/Admin/usersController");
const { addUserValidation } = require("../../validation/users/user.validation");

const multer = require("multer");
const path = require("path");
const { MulterError } = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profile_pictures");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if ((file.mimetype === file.mimetype) === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // define limit 5mb max file upload size
  },
  // fileFilter:fileFilter
});

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      message: err.message,
    });
  } else {
    res.json({
      Error: err.message,
    });
  }
}
const router = express.Router();

router.get("/", userController.index);
// router.post('/', upload.single('profile_picture'),errorHandler, addUserValidation, userController.store);
router.post("/", userController.store);
router.delete("/:id", userController.destroy);
router.patch("/:id", userController.update);
router.get("/role/:role", userController.users_by_role);

module.exports = router;
