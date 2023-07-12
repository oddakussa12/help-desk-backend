
const FAQ = require("../../../models/FAQ");
const mongoose = require("mongoose");

const getAllFaqs = (req, res) => {
  FAQ.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

module.exports = {
  getAllFaqs,
};
