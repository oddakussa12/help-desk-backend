const FAQ = require('../models/FAQ');

const index = (req, res) => {
    FAQ.find().sort({ createdAt: -1 })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

const show = (req, res) => {
    const id = req.params.id;
    FAQ.findById(id)
      .then(result => {
        if(!result){
            res.json({message: "No FAQ found with given id"});
        }else{
            res.json(result);
        }
      })
      .catch(err => {
        res.status(404).json({ Error: err });
      });
  }

const store = async(req, res) => {
  const faq = new FAQ({
    title: req.body.title,
    description: req.body.description,
  });
  
  try{
    const result = await faq.save();
    res.json(result);
  }catch(err){
    res.status(500).send({error: 'Error ' +err })
  }
}

const update = (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {

        const id = req.params.id;

        FAQ.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                  message: `Cannot update FAQ with id=${id}. Maybe it was not found!`
                });
            } else res.send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating FAQ with id=" + id
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
  FAQ.findByIdAndDelete(id)
    .then(result => {
        if (!result) {
            res.status(404).json({
              message: `Cannot delete FAQ with id=${id}. Maybe it was not found!`
            });
        } else res.json({ message: "Delete successfully." });
    })
    .catch(err => {
      res.json("Error: " + err);
    });
}

module.exports = {
  index,
  show,  
  store, 
  update,
  destroy
}