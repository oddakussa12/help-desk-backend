const FAQ = require("../../../models/FAQ");
const mongoose = require("mongoose");

const faq_detail = (req, res) => {
  const id = req.params.id;
  FAQ.findById(id)
    .populate("created_by", "name")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error: " + err);
    });
};

const faq_create_post = async (req, res) => {
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

const created_by_me = async (req, res) => {
  const auth_user_id = res.locals.user._id;
  var condition = auth_user_id
    ? { created_by: mongoose.Types.ObjectId(auth_user_id) }
    : {};
  const faqs = await FAQ.find(condition)
    .sort({ createdAt: -1 })
    .populate("created_by", "name");

  if (faqs.length === 0) {
    return res.status(403).json({ message: "You have't created any faqs yet." });
  }
  res.json(faqs);
};

const faq_update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    FAQ.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update FAQ with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "FAQ updated successfully." });
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

const faq_delete = (req, res) => {
  const id = req.params.id;
  FAQ.findByIdAndDelete(id)
    .then((result) => {
      res.json({ message: "FAQ deleted" });
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

module.exports = {
  faq_detail,
  faq_create_post,
  faq_delete,
  faq_update,
  created_by_me,
};
