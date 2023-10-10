const User = require("../../../models/User");

// handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "The email is already taken.";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const index = (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .populate("role", "name")
    .populate("level", "name")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const store = async (req, res) => {
  // const user_data =  { ...req.body, profile_picture: process.env.BASE_URL+req.file.path };
  const user_data = req.body;

  try {
    const user = await User.create(user_data);
    res.json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update ticket status with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating ticket status with id=" + id,
        });
      });
  } else {
    return res.status(400).json({
      message: "Data to update can not be empty!",
    });
  }
};

const destroy = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete user with id=${id}. Maybe it was not found!`,
        });
      } else res.json({ message: "Delete successfully." });
    })
    .catch((err) => {
      res.json("Error: " + err);
    });
};

const users_by_role = async (req, res) => {
  const role = req.params.role;
  try {
    await User.find()
      .populate("role")
      .exec((err, users) => {
        if (err) {
          return;
        }
        const usersByRole = users.filter((user) => user.role.name === role);
        res.json(usersByRole);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
  users_by_role,
};
