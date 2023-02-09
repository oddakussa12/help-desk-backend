const TicketPriority = require('../models/TicketPriority');

const index = (req, res) => {
    TicketPriority.find().sort({ createdAt: -1 })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

const store = async(req, res) => {
  const ticketPriority = new TicketPriority({
    name: req.body.name,
  });
  
  try{
    const result = await ticketPriority.save();
    res.json(result);
  }catch(err){
    res.status(500).send({error: 'Error ' +err })
  }
}


const update = (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {

        const id = req.params.id;

        TicketPriority.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                  message: `Cannot update ticket priority with id=${id}. Maybe it was not found!`
                });
            } else res.send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating ticket priority with id=" + id
            });
        });
    }else{
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }
}

const destroy = (req, res) => {
  const id = req.params.id;
  TicketPriority.findByIdAndDelete(id)
    .then(result => {
        if (!result) {
            res.status(404).json({
              message: `Cannot delete ticket priority with id=${id}. Maybe it was not found!`
            });
        } else res.json({ message: "Delete successfully." });
    })
    .catch(err => {
      res.json("Error: " + err);
    });
}

module.exports = {
  index,  
  store, 
  update,
  destroy
}