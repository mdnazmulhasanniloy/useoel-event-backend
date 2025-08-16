import { MonthlyIncome } from './dashboard.interface';
import moment from 'moment';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';
import Payment from '../payments/payments.models';
import { initializeMonthlyData } from './dashboard.utils';
import pickQuery from '../../utils/pickQuery';
import { Types } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';

const getDashboardData = async (query: Record<string, any>) => {
  const incomeYear = moment(query.year).year() || moment().year();

  const earningData = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
        isDeleted: false,
      },
    },
    {
      $facet: {
        totalEarnings: [
          {
            $group: { _id: null, total: { $sum: '$amount' } },
          },
        ],
        toDayEarnings: [
          {
            $match: {
              createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lte: moment().endOf('day').toDate(),
              },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$amount' } },
          },
        ],
        monthlyIncome: [
          {
            $match: {
              createdAt: {
                $gte: moment().year(incomeYear).startOf('year').toDate(),
                $lte: moment().year(incomeYear).endOf('year').toDate(),
              },
            },
          },
          {
            $group: {
              _id: { month: { $month: '$createdAt' } },
              income: { $sum: '$amount' },
            },
          },
          { $sort: { '_id.month': 1 } },
        ],
      },
    },
  ]).then(data => data[0]);

  const monthlyIncome = initializeMonthlyData('income') as MonthlyIncome[];
  earningData.monthlyIncome.forEach(
    ({ _id, income }: { _id: { month: number }; income: number }) => {
      monthlyIncome[_id.month - 1].income = Math.round(income);
    },
  );

  const [userData] = await User.aggregate([
    {
      $match: {
        isDeleted: false,
        'verification.status': true,
      },
    },
    {
      $facet: {
        totalCoach: [
          { $match: { role: USER_ROLE.coach } },
          { $count: 'total' },
        ],
        totalPlayer: [
          { $match: { role: USER_ROLE.player } },
          { $count: 'total' },
        ],
        totalUsers: [{ $match: { role: USER_ROLE.user } }, { $count: 'total' }],
        totalRegisteredUsers: [{ $count: 'total' }],

        lastRegisteredUserData: [
          {
            $match: {
              role: { $ne: USER_ROLE.admin },
            },
          },

          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 10,
          },
        ],
      },
    },
  ]);

  return {
    toDayIncome: earningData?.toDayEarnings[0]?.total || 0,
    totalIncome: earningData?.totalEarnings[0]?.total || 0,
    monthlyIncome,
    totalUsers: userData?.totalUsers[0]?.total || 0,
    totalPlayer: userData?.totalPlayer[0]?.total || 0,
    totalCoach: userData?.totalCoach[0]?.total || 0,
    totalRegisteredUsers: userData?.totalRegisteredUsers[0]?.total || 0,
    lastRegisteredUserData: userData?.lastRegisteredUserData || [],
  };
};

const getAdminEarning = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;
  const pipeline = [];

  pipeline.push({
    $match: {
      isPaid: true,
      isDeleted: false,
    },
  });

  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: ['tranId', 'othersFacilities'].map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  if (Object.entries(filtersData).length) {
    Object.entries(filtersData).forEach(([field, value]) => {
      if (/^\[.*?\]$/.test(value)) {
        const match = value.match(/\[(.*?)\]/);
        const queryValue = match ? match[1] : value;
        pipeline.push({
          $match: {
            [field]: { $in: [new Types.ObjectId(queryValue)] },
          },
        });
        delete filtersData[field];
      } else {
        // 🔁 Convert to number if numeric string
        if (!isNaN(value)) {
          filtersData[field] = Number(value);
        }
      }
    });

    if (Object.entries(filtersData).length) {
      pipeline.push({
        $match: {
          $and: Object.entries(filtersData).map(([field, value]) => ({
            isDeleted: false,
            [field]: value,
          })),
        },
      });
    }
  }

  // Sorting condition
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(pagination);

  if (sort) {
    const sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: -1 };
      }
      return { [trimmedField]: 1 };
    });

    pipeline.push({ $sort: Object.assign({}, ...sortArray) });
  }
  pipeline.push({
    $facet: {
      totalData: [{ $count: 'total' }],
      paginatedData: [
        { $skip: skip },
        { $limit: limit },
        // Lookups
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  phoneNumber: 1,
                  profile: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'subscription',
            foreignField: '_id',
            as: 'subscription',
          },
        },

        {
          $addFields: {
            user: { $arrayElemAt: ['$user', 0] },
            subscription: { $arrayElemAt: ['$subscription', 0] },
          },
        },
      ],
    },
  });

  const [earningData] = await Payment.aggregate(pipeline);

  const earningOverView = await Payment.aggregate([
    {
      $match: {
        isPaid: true,
        isDeleted: false,
      },
    },
    {
      $facet: {
        totalEarnings: [
          {
            $group: { _id: null, total: { $sum: '$amount' } },
          },
        ],

        toDayEarnings: [
          {
            $match: {
              createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lte: moment().endOf('day').toDate(),
              },
            },
          },
          {
            $group: { _id: null, total: { $sum: '$amount' } },
          },
        ],
      },
    },
  ]).then(data => data[0]);

  const total = earningData?.totalData?.[0]?.total || 0;
  const data = earningData?.paginatedData || [];

  return {
    meta: { page, limit, total },
    toDayEarnings: earningOverView?.toDayEarnings[0]?.total || 0,
    totalEarnings: earningOverView?.totalEarnings[0]?.total || 0,
    EarningsData: data,
  };
};
export const dashboardService = { getDashboardData, getAdminEarning };
