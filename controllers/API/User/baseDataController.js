const IssueCategory = require("../../../models/IssueCategory");

const mongoose = require("mongoose");

const issueCategoryIndex = (req, res) => {
    IssueCategory.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

module.exports = {
    issueCategoryIndex
};
