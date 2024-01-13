const Complain = require("../../../models/Complain");
const Ticket = require("../../../models/ticket");

const myComplains = (req, res) => {
    Complain.find()
        .sort({ createdAt: -1 })
        .populate("assigne", "name")
        .populate("ticket")
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.send("Error: " + err);
        });
};

const createComplain = async (req, res) => {
    const ticket_id = req.body?.ticket;
    // Find the ticket with the provided ticket
    const ticket = await Ticket.findOne({ _id: ticket_id });

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const assigne = ticket?.assignee;

    // Create a new complaint document
    const complaint = new Complain({
        ...req.body,
        created_by: res.locals.user._id,
        assigne,
    });

    try {
        const result = await complaint.save();
        return res.status(200).json({ data: result, message: "Complaint created successfully" });
    } catch (err) {
        res.status(500).send({ error: "Error " + err });
    }
};

const showComplain = (req, res) => {
    const id = req.params.id;
    Complain.findById(id)
        .populate("assigne", "name")
        .populate("ticket", "subject")
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send("Error: " + err);
        });
};

const updateComplain = (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {
        const id = req.params.id;

        Complain.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data) => {
                if (!data) {
                    res.status(404).json({
                        message: `Cannot update complain with id=${id}. Not found!`,
                    });
                } else res.send({ message: "Complain updated successfully." });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Error updating complian with id=" + id,
                });
            });
    } else {
        return res.status(400).json({
            message: "Data to update can not be empty!",
        });
    }
};

const deleteComplain = (req, res) => {
    const id = req.params.id;
    Complain.findByIdAndDelete(id)
        .then((result) => {
            res.json({ message: "Complain deleted" });
        })
        .catch((err) => {
            res.send("Error: " + err);
        });
};

module.exports = {
    myComplains,
    showComplain,
    createComplain,
    updateComplain,
    deleteComplain
};
