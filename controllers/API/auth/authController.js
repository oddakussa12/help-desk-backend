const User = require("../../../models/User");
const RefreshToken = require("../../../models/RefreshToken");
const jwt = require("jsonwebtoken");

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
    errors.email = "that email is already registered";
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

// create json web token
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "help desk secret", {
    expiresIn: "50d",
  });
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, "help desk refresh secret");
};

// controller actions

module.exports.signup_post = async (req, res) => {
  // const { name, phone, email, password } = req.body;

  try {
    let user = await User.create(req.body);
    user = await user.populate("role").execPopulate();
    const access_token = createToken(user._id);
    const refresh_token = createRefreshToken(user._id);
    await RefreshToken.create({ refresh_token });
    res.cookie("jwt", access_token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    const user = await User.login(phone_number, password);
    const access_token = createToken(user._id);
    const refresh_token = createRefreshToken(user._id);
    await RefreshToken.create({ refresh_token });
    res.cookie("jwt", access_token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = async (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  // check db if refresh-token exists
  var condition = refresh_token
    ? { refresh_token: { $regex: new RegExp(refresh_token), $options: "i" } }
    : {};
  const refresh_token_db = await RefreshToken.find(condition);

  if (refresh_token_db.length === 0) {
    return res.status(403).json({ message: "Refresh token is not valid" });
  }

  RefreshToken.findByIdAndRemove(refresh_token_db[0]._id)
    .then(() => {
      return res.json({ message: "You have sucessfully Signedout" });
    })
    .catch((err) => {
      return res.status(500).json({ Error: err });
    });
};

module.exports.refreshToken = async (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }
  // check db if refresh-token exists
  var condition = refresh_token
    ? { refresh_token: { $regex: new RegExp(refresh_token), $options: "i" } }
    : {};
  const refresh_token_db = await RefreshToken.find(condition);

  if (refresh_token_db.length === 0) {
    return res.status(403).json({ message: "Refresh token is not valid" });
  }

  jwt.verify(refresh_token, "help desk refresh secret", (err, user) => {
    err && console.log(err);
    RefreshToken.findByIdAndRemove(refresh_token_db[0]._id)
      .then(() => {
        const access_token = createToken(user._id);
        const refresh_token = createRefreshToken(user._id);

        RefreshToken.create({ refresh_token })
          .then(() => {
            res.status(200).json({
              access_token: access_token,
              refresh_token: refresh_token,
            });
          })
          .catch((err) => {
            return res.status(500).json({ Error: err });
          });
      })
      .catch((err) => {
        return res.status(500).json({ Error: err });
      });
  });
};
