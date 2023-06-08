const SupportLevel = require("../../../models/SupportLevel");

const index = (req, res) => {
  SupportLevel.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const store = async (req, res) => {
  const supportLevel = new SupportLevel({
    name: req.body.name,
  });

  try {
    const result = await supportLevel.save();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    SupportLevel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update support level with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating support level with id=" + id,
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
  SupportLevel.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete support level with id=${id}. Maybe it was not found!`,
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
