const TicketStatus = require("../../../models/TicketStatus");

const index = (req, res) => {
  TicketStatus.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const store = async (req, res) => {
  const ticketStstus = new TicketStatus({
    name: req.body.name,
  });

  try {
    const result = await ticketStstus.save();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    TicketStatus.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
  TicketStatus.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({
          message: `Cannot delete ticket status with id=${id}. Maybe it was not found!`,
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
