const User = require("../../../models/User");
const Ticket = require('../../../models/ticket');
const mongoose = require("mongoose");


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

const supportPerformance = async (req, res) => {
  User.aggregate([
    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: 'assignee',
        as: 'tickets'
      }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'roleInfo'
      }
    },
    {
      $lookup: {
        from: 'ticketstatuses',
        localField: 'tickets.status',
        foreignField: '_id',
        as: 'statusInfo'
      }
    },
  
    {
      $unwind: {
        path: '$roleInfo',
        preserveNullAndEmptyArrays: true
      }
    },
    { $unwind: { path: '$statusInfo', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$_id',
        supportPersonName: { $first: '$name' },
        supportPersonRole: { $first: '$roleInfo.name' },
        closedCount: {
          $sum: {
            $cond: [{ $eq: ['$statusInfo.name', 'Closed'] }, 1, 0]
          }
        },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ['$statusInfo.name', 'Pending'] }, 1, 0]
          }
        },
        openCount: {
          $sum: {
            $cond: [{ $eq: ['$statusInfo.name', 'Open'] }, 1, 0]
          }
        },
        totalCount: { $sum: { $size: '$tickets' } }
      }
    }
  ])
    .exec((err, results) => {
      if (err) {
        // Handle the error
      } else {
        // Process the results
        res.json(results);
      }
    });

}
module.exports = {
  user_count,
  getTicketStatusCounts,
  supportPerformance
};
