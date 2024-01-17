const Complain = require("../../../models/Complain");
const mongoose = require("mongoose");

const assignedToMe = async (req, res) => {
    const auth_user_id = res?.locals?.user?._id;
    var condition = auth_user_id
        ? { assigne: mongoose.Types.ObjectId(auth_user_id) }
        : {};
    const complains = await Complain.find(condition)
        .sort({ createdAt: -1 })
        .populate("created_by")
        .populate("ticket")

    res.json(complains);
};

const respond = async (req, res) => {
    const complain_id = req.body.complain_id;
    const response = req.body.response;

    Complain.findByIdAndUpdate(
        complain_id,
        { response: response },
        { new: true },
        function (err, complain) {
            if (err) {
                res.status(500).send({ error: "Error " + err });
            } else {
                return res.status(200).json({ data: complain, message: "Response saved successfully" });
            }
        }
    );
};

const updateStatus = async (req, res) => {
    const complain_id = req.body.complain_id;
    const status = req.body.status;

    Complain.findByIdAndUpdate(
        complain_id,
        { status: status },
        { new: true },
        function (err, complain) {
            if (err) {
                res.status(500).send({ error: "Error " + err });
            } else {
                return res.status(200).json({ data: complain, message: "Status updated successfully" });
            }
        }
    );
};

const showComplain = (req, res) => {
    const id = req.params.id;
    Complain.findById(id)
        .populate("assigne", "name")
        .populate("ticket", "subject")
        .populate({ path: "created_by", select: "name phone email -_id" })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send("Error: " + err);
        });
};

module.exports = {
    assignedToMe,
    showComplain,
    respond,
    updateStatus
};
