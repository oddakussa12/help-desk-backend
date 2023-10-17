const User = require("../../../models/User");
const Ticket = require('../../../models/ticket');


const user_count = async (req, res) => {
  try {
    const counts = await User.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$role.name',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      admin: 0,
      support: 0,
      user: 0
    };

    counts.forEach(({ _id, count }) => {
      if (_id === 'Admin') {
        result.admin = count;
      } else if (_id === 'Support') {
        result.support = count;
      } else if (_id === 'User') {
        result.user = count;
      }
    });

    res.json(result);

  } catch (error) {
    console.error('Error:', error);
  }
}

const getTicketStatusCounts = async (req, res) => {
  try {
    const counts = await Ticket.aggregate([
      {
        $lookup: {
          from: 'ticketstatuses',
          localField: 'status',
          foreignField: '_id',
          as: 'statusInfo'
        }
      },
      {
        $group: {
          _id: '$status',
          status: { $first: { $arrayElemAt: ['$statusInfo', 0] } },
          count: { $sum: 1 }
        }
      }
    ]);

    const ticketStatusCounts = {};

    counts.forEach((item) => {
      const statusName = item.status.name;
      const count = item.count;
      ticketStatusCounts[statusName] = count;
    });

    res.json(ticketStatusCounts);
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
    user_count,
    getTicketStatusCounts
};
