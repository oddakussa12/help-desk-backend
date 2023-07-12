const TicketStatus = require("../../../models/TicketStatus");
const mongoose = require("mongoose");

const get_all_ticket_statues = (req, res) => {
    TicketStatus.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  };

module.exports = {
  get_all_ticket_statues,
};
