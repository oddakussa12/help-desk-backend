const User = require('../models/User');
const Role = require('../models/Role');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'The email is already taken.';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const index = (req, res) => {
    User.find().sort({ createdAt: -1 }).populate('role','name').populate('level','name')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.send("Error: " + err);
    });
}

const store = async(req, res) => {
  const { name, phone, email, password, role, level } = req.body;

  try {
    const user = await User.create({ name, phone, email, password, role, level });
    res.json(user);
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

const update = (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length !== 0) {

        const id = req.params.id;

        User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).json({
                  message: `Cannot update ticket status with id=${id}. Maybe it was not found!`
                });
            } else res.send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating ticket status with id=" + id
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
  User.findByIdAndDelete(id)
    .then(result => {
        if (!result) {
            res.status(404).json({
              message: `Cannot delete user with id=${id}. Maybe it was not found!`
            });
        } else res.json({ message: "Delete successfully." });
    })
    .catch(err => {
      res.json("Error: " + err);
    });
}

const users_by_role = async (req, res) => {
  const role = req.params.role;

  await Role.aggregate([
    {
      $match: {
        "name": role
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "role",
        as: "users"
      }
    }
  ]).then((result)=> {
    res.json(result)
  }).catch((err)=>{
    res.json(err)
  });
}

module.exports = {
  index,  
  store, 
  update,
  destroy,
  users_by_role
}