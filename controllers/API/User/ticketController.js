const Ticket = require("../../../models/ticket");
const User = require("../../../models/User");
const mongoose = require("mongoose");

const ticket_details = (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .populate("status", "name")
    .populate("assignee", "name")
    .populate("priority", "name")
    .populate("complain")
    .populate("created_by", "name")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error: " + err);
    });
};

async function findSupportUser(issueCategory) {
  try {
    const supportUser = await User.findOne({
      role: { $in: ['6474de39841027567ca95e38'] },
      issueCategory: issueCategory,
    }).populate('role');
    return supportUser;
  } catch (error) {
    throw new Error('Failed to find support user');
  }
}

const ticket_create_post = async (req, res) => {
  const newTicket = new Ticket({
    ...req.body,
    created_by: res.locals.user._id,
  });

  try {
    // Find the suitable support user
    findSupportUser(newTicket.category)
      .then((supportUser) => {
        // Assign the ticket to the support user
        newTicket.assignee = supportUser?._id;
        // Save the ticket
        return newTicket.save();
      })
      .then((savedTicket) => {
        res.json(savedTicket);
      })
      .catch((error) => {
        console.error('Error assigning ticket:', error);
      });
  } catch (err) {
    res.status(500).send({ error: "Error " + err });
  }
};

const created_by_me = async (req, res) => {
  // console.log("......................res.locals.user", res?.locals?.user);
  const auth_user_id = res?.locals?.user?._id;
  var condition = auth_user_id
    ? { created_by: mongoose.Types.ObjectId(auth_user_id) }
    : {};
  const tickets = await Ticket.find(condition)
    .sort({ createdAt: -1 })
    .populate("status", "name")
    .populate("category", "name")
    .populate("complain")
    .populate("priority", "name");

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
  ticket_details,
  ticket_create_post,
  ticket_delete,
  ticket_update,
  created_by_me,
};
