const User = require("../../../models/User");

const show = async (req, res) => {
  const auth_user_id = res.locals.user._id;
  const user = await User.find(auth_user_id)
    .populate("role", "name")

  res.json(user);
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = res.locals.user._id;
    console.log("Auth user id", id);

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update user!`,
          });
        } else res.send({ message: "Profile updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating user profile",
        });
      });
  } else {
    return res.status(400).json({
      message: "Data to update can not be empty!",
    });
  }
};

const update_password = async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
      const id = res.locals.user._id;
      const user = await User.findById(id).select('+password');

      // Verify the old password
      const isOldPasswordValid = await user.comparePassword(req?.body?.old_password);
      if (!isOldPasswordValid) {
        // throw new Error('Invalid old password');
        res.status(400).json({
          message: "Invalid old password",
        });
      }
      // Validate the new password and confirm password
      if (req?.body?.new_password !== req?.body?.confirm_password) {
        res.status(400).json({
          message: "New password and confirm password do not match",
        });
      }
      // Update the user's password
      user.password = req?.body?.new_password;
      await user.save();
      res.json(user);
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  show,
  update,
  update_password
};
