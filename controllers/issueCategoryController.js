const IssueCategory = require("../models/IssueCategory");
const FAQ = require("../models/FAQ");

const index = async (req, res) => {
  const latest_category = await IssueCategory.findOne({}).sort({ createdAt: -1 });
  console.log(latest_category)
  const faqs = await FAQ.find({ category_id: latest_category._id }).catch((err) => {
    res.status(404).json({ Error: err });
  });

  console.log(faqs);

  IssueCategory.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json({'categories': result, faqs: faqs});
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const store = async (req, res) => {
  const issueCategory = new IssueCategory({
    name: req.body.name,
  });

  try {
    const result = await issueCategory.save();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    IssueCategory.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update category with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating category with id=" + id,
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
  IssueCategory.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete category with id=${id}. Maybe it was not found!`,
        });
      } else res.json({ message: "Delete successfully." });
    })
    .catch((err) => {
      res.json("Error: " + err);
    });
};

module.exports = {
  index,
  store,
  update,
  destroy,
};
