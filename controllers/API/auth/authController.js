const User = require("../../../models/User");
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

module.exports.signup_post = async (req, res) => {
  // const { name, phone, email, password } = req.body;
  try {
    let user = await User.create(req.body);
    user = await user.populate("role").execPopulate();
    const access_token = createToken(user._id);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000
    })
      .status(201)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        access_token: access_token,
      });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const access_token = createToken(user._id);
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000
    })
      .status(200)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        access_token: access_token,
      });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out." });
};

module.exports.refreshToken = async (req, res) => {
  const access_token = req.cookies.access_token;

  jwt.verify(access_token, "help desk secret", (err, user) => {
    err && console.log(err);
    const access_token = createToken(user._id);

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAge * 1000
    })
      .status(200)
      .json({
        access_token: access_token,
      });
  });
};
