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


module.exports = {
  show,
  update
};
