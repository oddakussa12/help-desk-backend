const joi = require("@hapi/joi");

const schema = {
    user: joi.object({
        name: joi.string().max(100).required(),
        email: joi.string().email().required(),
        role: joi.string().required(),
        // level: joi.string(),
        // phone: joi.number().integer().min(0000000000).message("Invalid phone number").
        //     max(9999999999).message("Invalid phone number").required(),
        password: joi.string().min(10).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    })
};

module.exports = schema;