// src/modules/dashboard/dashboard.controller.js

import { orderModel }      from "../../DB/model/order.model.js";
import { orderBuyModel }   from "../../DB/model/orderBuy.model.js";
import { carModel }        from "../../DB/model/carRent.model.js";
import { carbuymodel }     from "../../DB/model/carBuy.model.js";
import { userModel }       from "../../DB/model/user.model.js";
import {reviewModel}         from "../../DB/model/review.model.js";

const ok = (res, data) =>
  res.status(200).json({ success: true, data });


export const getOverview = async (req, res, next) => {
  try {
    const traderId = req.user._id;

    const [
      totalRentRevenue,
      totalBuyRevenue,
      activeRentals,
      pendingRentOrders,
      pendingBuyOrders,
      completedRentOrders,
      completedBuyOrders,
      uniqueRentCustomers,
      uniqueBuyCustomers,
      reviewStats,
      recentRentOrders,
      recentBuyOrders,
    ] = await Promise.all([

      // إجمالي إيرادات الإيجار
      orderModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),

      // إجمالي إيرادات البيع
      orderBuyModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),

      // الإيجارات النشطة (accepted)
      orderModel.countDocuments({ owner: traderId, status: "accepted" }),

      // الحجوزات المعلقة (rent)
      orderModel.countDocuments({ owner: traderId, status: "pending" }),

      // الطلبات المعلقة (buy)
      orderBuyModel.countDocuments({ owner: traderId, status: "pending" }),

      // الحجوزات المكتملة (rent)
      orderModel.countDocuments({ owner: traderId, status: "completed" }),

      // الطلبات المكتملة (buy)
      orderBuyModel.countDocuments({ owner: traderId, status: "completed" }),

      // عملاء الإيجار الفريدين
      orderModel.distinct("user", { owner: traderId }),

      // عملاء الشراء الفريدين
      orderBuyModel.distinct("user", { owner: traderId }),

      // متوسط التقييمات
      reviewModel.aggregate([
        {
          $lookup: {
            from: "carrents",
            localField: "car",
            foreignField: "_id",
            as: "carData",
          },
        },
        { $unwind: "$carData" },
        { $match: { "carData.owner": traderId } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),

      // أحدث 5 حجوزات إيجار
      orderModel
        .find({ owner: traderId })
        .populate("user", "userName email phone avatar")
        .populate("car", "carbrand carname carmodel year carimage carprice")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // أحدث 5 طلبات شراء
      orderBuyModel
        .find({ owner: traderId })
        .populate("user", "userName email phone avatar")
        .populate("car", "carbrand carname carmodel year carimage carprice")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // دمج العملاء الفريدين
    const allCustomerIds = new Set([
      ...uniqueRentCustomers.map(String),
      ...uniqueBuyCustomers.map(String),
    ]);

    return ok(res, {
      revenue: {
        rent:  totalRentRevenue[0]?.total || 0,
        buy:   totalBuyRevenue[0]?.total  || 0,
        total: (totalRentRevenue[0]?.total || 0) + (totalBuyRevenue[0]?.total || 0),
      },
      activeRentals,
      pendingOrders: {
        rent:  pendingRentOrders,
        buy:   pendingBuyOrders,
        total: pendingRentOrders + pendingBuyOrders,
      },
      completedOrders: {
        rent:  completedRentOrders,
        buy:   completedBuyOrders,
        total: completedRentOrders + completedBuyOrders,
      },
      totalCustomers: allCustomerIds.size,
      reviews: {
        average: Number((reviewStats[0]?.avgRating || 0).toFixed(1)),
        total:   reviewStats[0]?.totalReviews || 0,
      },
      recentRentOrders,
      recentBuyOrders,
    });
  } catch (error) {
    next(error);
  }
};


export const getRentCars = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const filter = { owner: traderId };
    if (req.query.isavailable) filter.isavailable = req.query.isavailable;

    const [total, cars] = await Promise.all([
      carModel.countDocuments(filter),
      carModel
        .find(filter)
        .select("carbrand carname carmodel year location carprice fuel seatCount Body_Type Transmission carimage isavailable createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // لكل سيارة جيب عدد حجوزاتها وإيراداتها
    const carsWithStats = await Promise.all(
      cars.map(async (car) => {
        const [totalBookings, revenue, avgRating] = await Promise.all([
          orderModel.countDocuments({ car: car._id }),
          orderModel.aggregate([
            { $match: { car: car._id, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ]),
          reviewModel.aggregate([
            { $match: { car: car._id } },
            { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
          ]),
        ]);

        return {
          ...car,
          stats: {
            totalBookings,
            revenue:   revenue[0]?.total || 0,
            avgRating: Number((avgRating[0]?.avg || 0).toFixed(1)),
            reviews:   avgRating[0]?.count || 0,
          },
        };
      })
    );

    return ok(res, { total, page, limit, cars: carsWithStats });
  } catch (error) {
    next(error);
  }
};


export const getBuyCars = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [total, cars] = await Promise.all([
      carbuymodel.countDocuments({ owner: traderId }),
      carbuymodel
        .find({ owner: traderId })
        .select("carbrand carname carmodel year location carprice fuel seatCount Body_Type Transmission carimage isavailable createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const carsWithStats = await Promise.all(
      cars.map(async (car) => {
        const [totalOffers, completedSales] = await Promise.all([
          orderBuyModel.countDocuments({ car: car._id }),
          orderBuyModel.countDocuments({ car: car._id, status: "completed" }),
        ]);

        return {
          ...car,
          stats: { totalOffers, completedSales },
        };
      })
    );

    return ok(res, { total, page, limit, cars: carsWithStats });
  } catch (error) {
    next(error);
  }
};


export const getRentOrders = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page   = Number(req.query.page)   || 1;
    const limit  = Number(req.query.limit)  || 20;
    const skip   = (page - 1) * limit;
    const filter = { owner: traderId };
    if (req.query.status) filter.status = req.query.status;

    const [total, orders] = await Promise.all([
      orderModel.countDocuments(filter),
      orderModel
        .find(filter)
        .populate("user", "userName email phone avatar")
        .populate("car",  "carbrand carname carmodel year carimage carprice location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return ok(res, { total, page, limit, orders });
  } catch (error) {
    next(error);
  }
};


export const getBuyOrders = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page   = Number(req.query.page)   || 1;
    const limit  = Number(req.query.limit)  || 20;
    const skip   = (page - 1) * limit;
    const filter = { owner: traderId };
    if (req.query.status) filter.status = req.query.status;

    const [total, orders] = await Promise.all([
      orderBuyModel.countDocuments(filter),
      orderBuyModel
        .find(filter)
        .populate("user", "userName email phone avatar")
        .populate("car",  "carbrand carname carmodel year carimage carprice location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return ok(res, { total, page, limit, orders });
  } catch (error) {
    next(error);
  }
};


export const getCustomers = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    
    const [rentCustomerIds, buyCustomerIds] = await Promise.all([
      orderModel.distinct("user",    { owner: traderId }),
      orderBuyModel.distinct("user", { owner: traderId }),
    ]);

    const allIds = [...new Set([
      ...rentCustomerIds.map(String),
      ...buyCustomerIds.map(String),
    ])];

    const total = allIds.length;

    // جيب بيانات العملاء
    const customers = await userModel
      .find({ _id: { $in: allIds } })
      .select("userName email phone avatar createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    // لكل عميل جيب نشاطه
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const [rentOrders, buyOrders, totalSpentRent, totalSpentBuy] = await Promise.all([
          orderModel.countDocuments({ user: customer._id, owner: traderId }),
          orderBuyModel.countDocuments({ user: customer._id, owner: traderId }),
          orderModel.aggregate([
            { $match: { user: customer._id, owner: traderId, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ]),
          orderBuyModel.aggregate([
            { $match: { user: customer._id, owner: traderId, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$carprice" } } },
          ]),
        ]);

        return {
          ...customer,
          activity: {
            rentOrders,
            buyOrders,
            totalOrders: rentOrders + buyOrders,
            totalSpent:  (totalSpentRent[0]?.total || 0) + (totalSpentBuy[0]?.total || 0),
          },
        };
      })
    );

    return ok(res, { total, page, limit, customers: customersWithStats });
  } catch (error) {
    next(error);
  }
};


export const getReviews = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

   
    const traderCars = await carModel.distinct("_id", { owner: traderId });

    const filter = { car: { $in: traderCars } };
    if (req.query.rating) filter.rating = Number(req.query.rating);

    const [total, reviews, ratingStats] = await Promise.all([
      reviewModel.countDocuments(filter),

      reviewModel
        .find(filter)
        .populate("user", "userName email avatar")
        .populate("car",  "carbrand carname carmodel year carimage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      reviewModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            total:     { $sum: 1 },
            stars5:    { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            stars4:    { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            stars3:    { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            stars2:    { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            stars1:    { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          },
        },
      ]),
    ]);

    return ok(res, {
      total,
      page,
      limit,
      stats: {
        average: Number((ratingStats[0]?.avgRating || 0).toFixed(1)),
        distribution: {
          5: ratingStats[0]?.stars5 || 0,
          4: ratingStats[0]?.stars4 || 0,
          3: ratingStats[0]?.stars3 || 0,
          2: ratingStats[0]?.stars2 || 0,
          1: ratingStats[0]?.stars1 || 0,
        },
      },
      reviews,
    });
  } catch (error) {
    next(error);
  }
};


export const getAnalytics = async (req, res, next) => {
  try {
    const traderId = req.user._id;

    // آخر 12 شهر
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [
      monthlyRentRevenue,
      monthlyBuyRevenue,
      monthlyRentOrders,
      monthlyBuyOrders,
      statusDistributionRent,
      statusDistributionBuy,
      topRentCars,
      topBuyCars,
      conversionRent,
      conversionBuy,
    ] = await Promise.all([

      // إيرادات الإيجار شهريًا
      orderModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: "completed",
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // إيرادات البيع شهريًا
      orderBuyModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: "completed",
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$carprice" },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // عدد أوردرات الإيجار شهريًا (كل الحالات)
      orderModel.aggregate([
        {
          $match: {
            owner: traderId,
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // عدد أوردرات الشراء شهريًا
      orderBuyModel.aggregate([
        {
          $match: {
            owner: traderId,
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // توزيع الحالات - إيجار
      orderModel.aggregate([
        { $match: { owner: traderId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // توزيع الحالات - شراء
      orderBuyModel.aggregate([
        { $match: { owner: traderId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // أعلى 5 سيارات إيجار أداءً
      orderModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        {
          $group: {
            _id:      "$car",
            revenue:  { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from:         "carrents",
            localField:   "_id",
            foreignField: "_id",
            as:           "car",
          },
        },
        { $unwind: "$car" },
        {
          $project: {
            revenue: 1,
            bookings: 1,
            "car.carbrand":  1,
            "car.carname":   1,
            "car.carmodel":  1,
            "car.carimage":  1,
            "car.carprice":  1,
          },
        },
      ]),

      // أعلى 5 سيارات بيع أداءً
      orderBuyModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        {
          $group: {
            _id:   "$car",
            sales: { $sum: 1 },
            revenue: { $sum: "$carprice" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from:         "carbuys",
            localField:   "_id",
            foreignField: "_id",
            as:           "car",
          },
        },
        { $unwind: "$car" },
        {
          $project: {
            sales: 1,
            revenue: 1,
            "car.carbrand":  1,
            "car.carname":   1,
            "car.carmodel":  1,
            "car.carimage":  1,
            "car.carprice":  1,
          },
        },
      ]),

      // معدل تحويل الإيجار (completed / total)
      orderModel.aggregate([
        { $match: { owner: traderId } },
        {
          $group: {
            _id:   null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          },
        },
      ]),

      // معدل تحويل الشراء
      orderBuyModel.aggregate([
        { $match: { owner: traderId } },
        {
          $group: {
            _id:   null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          },
        },
      ]),
    ]);

    // دمج إيرادات الإيجار والشراء في timeline واحد
    const revenueMap = {};

    monthlyRentRevenue.forEach(({ _id, revenue, orders }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      if (!revenueMap[key]) revenueMap[key] = { month: key, rentRevenue: 0, buyRevenue: 0, rentOrders: 0, buyOrders: 0 };
      revenueMap[key].rentRevenue = revenue;
      revenueMap[key].rentOrders  = orders;
    });

    monthlyBuyRevenue.forEach(({ _id, revenue, orders }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      if (!revenueMap[key]) revenueMap[key] = { month: key, rentRevenue: 0, buyRevenue: 0, rentOrders: 0, buyOrders: 0 };
      revenueMap[key].buyRevenue = revenue;
      revenueMap[key].buyOrders  = orders;
    });

    const revenueTimeline = Object.values(revenueMap)
      .map(m => ({ ...m, totalRevenue: m.rentRevenue + m.buyRevenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // توزيع الحالات
    const formatStatus = (arr) =>
      arr.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

    // معدل التحويل
    const rentTotal     = conversionRent[0]?.total     || 0;
    const rentCompleted = conversionRent[0]?.completed || 0;
    const buyTotal      = conversionBuy[0]?.total      || 0;
    const buyCompleted  = conversionBuy[0]?.completed  || 0;

    return ok(res, {
      revenueTimeline,
      orderVolume: {
        rent: monthlyRentOrders,
        buy:  monthlyBuyOrders,
      },
      statusDistribution: {
        rent: formatStatus(statusDistributionRent),
        buy:  formatStatus(statusDistributionBuy),
      },
      topPerformingCars: {
        rent: topRentCars,
        buy:  topBuyCars,
      },
      conversionRate: {
        rent: rentTotal ? +((rentCompleted / rentTotal) * 100).toFixed(1) : 0,
        buy:  buyTotal  ? +((buyCompleted  / buyTotal)  * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  try {
    const traderId = req.user._id;

    const [
      totalEarningsRent,
      totalEarningsBuy,
      pendingRentRevenue,
      pendingBuyRevenue,
      monthlyBreakdown,
    ] = await Promise.all([

      // إجمالي الأرباح المكتملة - إيجار
      orderModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),

      // إجمالي الأرباح المكتملة - بيع
      orderBuyModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),

      // الرصيد المعلق - إيجار (accepted)
      orderModel.aggregate([
        { $match: { owner: traderId, status: "accepted" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),

      // الرصيد المعلق - بيع (accepted)
      orderBuyModel.aggregate([
        { $match: { owner: traderId, status: "accepted" } },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),

      // تفصيلة شهرية للأرباح
      orderModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        {
          $group: {
            _id: {
              year:  { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            rentEarnings: { $sum: "$totalPrice" },
            rentCount:    { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]),
    ]);

    const totalRent    = totalEarningsRent[0]?.total  || 0;
    const totalBuy     = totalEarningsBuy[0]?.total   || 0;
    const pendingRent  = pendingRentRevenue[0]?.total || 0;
    const pendingBuy   = pendingBuyRevenue[0]?.total  || 0;

    return ok(res, {
      available: totalRent + totalBuy,           // الرصيد المتاح (مكتمل)
      pending:   pendingRent + pendingBuy,        // الرصيد المعلق (accepted)
      total:     totalRent + totalBuy + pendingRent + pendingBuy,
      breakdown: {
        rent: { earned: totalRent, pending: pendingRent },
        buy:  { earned: totalBuy,  pending: pendingBuy  },
      },
      monthlyBreakdown,
    });
  } catch (error) {
    next(error);
  }
};


export const getRecentActivity = async (req, res, next) => {
  try {
    const traderId = req.user._id;
    const limit    = Number(req.query.limit) || 10;

    const [recentRentOrders, recentBuyOrders, recentReviews] = await Promise.all([
      orderModel
        .find({ owner: traderId })
        .populate("user", "userName avatar")
        .populate("car",  "carbrand carname carimage")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),

      orderBuyModel
        .find({ owner: traderId })
        .populate("user", "userName avatar")
        .populate("car",  "carbrand carname carimage")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),

      reviewModel
        .find({ car: { $in: await carModel.distinct("_id", { owner: traderId }) } })
        .populate("user", "userName avatar")
        .populate("car",  "carbrand carname")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
    ]);

    // دمج كل الأنشطة وترتيبها بالتاريخ
    const activities = [
      ...recentRentOrders.map(o => ({ type: "rent_order",  ...o })),
      ...recentBuyOrders.map(o  => ({ type: "buy_order",   ...o })),
      ...recentReviews.map(r    => ({ type: "review",      ...r })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     .slice(0, limit);

    return ok(res, { activities });
  } catch (error) {
    next(error);
  }
};