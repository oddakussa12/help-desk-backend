// const Ticket = require("../../../models/ticket");
const Ticket = require("../../../models/ticket");
const mongoose = require("mongoose");

const ticket_details = (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .populate("status", "name")
    .populate("assignee", "name")
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

const assigned_to_me = async (req, res) => {
  const auth_user_id = res.locals.user._id;
  var condition = auth_user_id
    ? { assignee: mongoose.Types.ObjectId(auth_user_id) }
    : {};
  const tickets = await Ticket.find(condition)
    .populate("status", "name")
    .populate("priority", "name")
    .populate("created_by", "name");

  if (tickets.length === 0) {
    return res
      .status(403)
      .json({ message: "You have't assigned to any tickets" });
  }
  res.json(tickets);
};

const reply = async (req, res) => {
  const ticket_id = req.params.ticket_id;
  const response = req.body.response;

  Ticket.findByIdAndUpdate(
    ticket_id,
    { response: response },
    { new: true },
    function (err, ticket) {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        // Send the updated ticket document back to the client
        res.json(ticket);
      }
    }
  );
};

const dashboard = async (req, res) => {
  const auth_user_id = res.locals?.user?._id;

  const [ticketCounts, totalTicketsAssignedToUser] = await Promise.all(
    [
      Ticket.aggregate([
        { 
          $lookup: {
            from: 'ticketstatuses',
            localField: 'status',
            foreignField: '_id',
            as: 'status'
          }
        },
        { $unwind: '$status' },
        { 
          $group: {
            _id: '$status.name',
            count: { $sum: 1 }
          }
        }
      ]),
      Ticket.countDocuments({ assignee: auth_user_id }),
    ]
  );

  const { count: openTicketCount = 0 } =
    ticketCounts.find((tc) => tc._id === "Open") || {};
  const { count: pendingTicketCount = 0 } =
    ticketCounts.find((tc) => tc._id === "Pending") || {};
  const { count: closedTicketCount = 0 } =
    ticketCounts.find((tc) => tc._id === "Closed") || {};

  const response = {
    totalTicketsAssignedToUser,
    openTicketCount,
    pendingTicketCount,
    closedTicketCount,
  };

  res.json(response);
};

const change_status = (req, res) => {
  const ticket_id = req.params.ticket_id;
  const status_id = req.body.status_id;

  Ticket.findByIdAndUpdate(
    ticket_id,
    { status: status_id },
    { new: true },
    function (err, ticket) {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        // Send the updated ticket document back to the client
        res.json(ticket);
      }
    }
  );
}

module.exports = {
  ticket_details,
  assigned_to_me,
  reply,
  dashboard,
  change_status,
};
