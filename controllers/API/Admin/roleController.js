const Role = require("../../../models/Role");

const index = (req, res) => {
  Role.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const store = async (req, res) => {
  const role = new Role({
    name: req.body.name,
  });

  try {
    const result = await role.save();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    Role.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update role with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating role with id=" + id,
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
  Role.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete Role with id=${id}. Maybe it was not found!`,
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
