const Ticket = require("../models/ticket");
const mongoose = require("mongoose");

const ticket_index = (req, res) => {
  Ticket.find()
    .sort({ createdAt: -1 })
    .populate("assignee", "name")
    .populate("created_by", "name")
    .populate("status", "name")
    .populate("priority", "name")
    // Ticket.find().sort({ createdAt: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

const ticket_details = (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .populate("status", "name")
    .populate("priority", "name")
    .populate("created_by", "name")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error: " + err);
    });
};

// const ticket_create_post = (req, res) => {
//   const ticket = new Ticket(req.body);
//   ticket.save()
//     .then(result => {
//       res.json(result)
//     })
//     .catch(err => {
//       res.send("Error: " + err);
//     });
// }

const ticket_create_post = async (req, res) => {
  const ticket = new Ticket({
    ...req.body,
    created_by: res.locals.user._id,
  });

  try {
    const result = await ticket.save();
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
  const tickets = await Ticket.find(condition)
    .sort({ createdAt: -1 })
    .populate("status", "name")
    .populate("priority", "name");

  if (tickets.length === 0) {
    return res.status(403).json({ message: "You have't created any tickets" });
  }
  res.json(tickets);
};

const assigned_to_me = async (req, res) => {
  console.log("You have reached here again");
  const auth_user_id = res.locals.user._id;
  var condition = auth_user_id
    ? { assignee: mongoose.Types.ObjectId(auth_user_id) }
    : {};
  const tickets = await Ticket.find(condition);

  if (tickets.length === 0) {
    return res
      .status(403)
      .json({ message: "You have't assigned to any tickets" });
  }
  res.json(tickets);
};

const ticket_update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    const id = req.params.id;

    Ticket.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).json({
            message: `Cannot update ticket with id=${id}. Maybe it was not found!`,
          });
        } else res.send({ message: "Ticket updated successfully." });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating ticket with id=" + id,
        });
      });
  } else {
    return res.status(400).json({
      message: "Data to update can not be empty!",
    });
  }
};

const ticket_delete = (req, res) => {
  const id = req.params.id;
  Ticket.findByIdAndDelete(id)
    .then((result) => {
      res.json({ message: "Ticket deleted" });
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
};

module.exports = {
  ticket_index,
  ticket_details,
  ticket_create_post,
  ticket_delete,
  ticket_update,
  created_by_me,
  assigned_to_me,
};
