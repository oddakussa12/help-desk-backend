const FAQ = require("../models/FAQ");

const index = (req, res) => {
  FAQ.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "created_by",
      select: "name",
      populate: { path: "level", select: "name" },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const faqByCategory = (req, res) => {
  const category_id = req.params.category_id;
  FAQ.find({ category_id: category_id })
    .then((result) => {
      if (!result) {
        res.json({ message: "No FAQ found in this category" });
      } else {
        res.json(result);
      }
    })
    .catch((err) => {
      res.status(404).json({ Error: err });
    });
};

const show = (req, res) => {
  const id = req.params.id;
  FAQ.findById(id)
    .populate({
      path: "created_by",
      select: "name",
      populate: { path: "level", select: "name" },
    })
    .then((result) => {
      if (!result) {
        res.json({ message: "No FAQ found with given id" });
      } else {
        res.json(result);
      }
    })
    .catch((err) => {
      res.status(404).json({ Error: err });
    });
};

const store = async (req, res) => {
  const faq = new FAQ({
    ...req.body,
    created_by: res.locals.user._id,
  });

  try {
    const result = await faq.save();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    FAQ.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update FAQ with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating FAQ with id=" + id,
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
  FAQ.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete FAQ with id=${id}. Maybe it was not found!`,
        });
      } else res.json({ message: "Delete successfully." });
    })
    .catch((err) => {
      res.json("Error: " + err);
    });
};

const changeStatus = (req, res) => {
  const id = req.params.id;
  
  FAQ.findById(id, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      doc.approved = !doc.approved;
      doc.save((err, updatedDoc) => {
        if (err) {
          res.json("Error: " + err);
        } else {
          res.json({ message: "Updated successfully." });
        }
      });
    }
  });
  
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  faqByCategory,
  changeStatus,
};
