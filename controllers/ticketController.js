const Ticket = require('../models/ticket');

const ticket_index = (req, res) => {
    Ticket.find().sort({ createdAt: -1 })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

const ticket_details = (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err);
      res.send("Error: " + err);
    });
}

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

const ticket_create_post = async(req, res) => {
  const ticket = new Ticket({
    subject: req.body.subject,
    description: req.body.description
  });
  
  try{
    const result = await ticket.save();
    res.json(result);
  }catch(err){
    res.status(500).send({error: 'Error ' +err })
  }
}


const ticket_update = (req, res) => {
  const id = req.params.id;
  Ticket. findById(id)
    .then(result => {
      res.json({message: "Ticket deleted"})
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

const ticket_delete = (req, res) => {
  const id = req.params.id;
  Ticket.findByIdAndDelete(id)
    .then(result => {
      res.json({message: "Ticket deleted"})
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

module.exports = {
  ticket_index, 
  ticket_details, 
  ticket_create_post, 
  ticket_delete,
  ticket_update
}