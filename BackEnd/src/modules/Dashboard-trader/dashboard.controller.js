// src/modules/dashboard/dashboard.controller.js
import mongoose from "mongoose";
import { orderModel } from "../../DB/model/order.model.js";
import { orderBuyModel } from "../../DB/model/orderBuy.model.js";
import { carModel } from "../../DB/model/carRent.model.js";
import { carbuymodel } from "../../DB/model/carBuy.model.js";
import { userModel } from "../../DB/model/user.model.js";
import { reviewModel } from "../../DB/model/review.model.js";

const ok = (res, data) => res.status(200).json({ success: true, data });

export const getOverview = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

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
      orderModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      orderBuyModel.aggregate([
        { $match: { owner: traderId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),
      orderModel.countDocuments({ owner: traderId, status: "accepted" }),
      orderModel.countDocuments({ owner: traderId, status: "pending" }),
      orderBuyModel.countDocuments({ owner: traderId, status: "pending" }),
      orderModel.countDocuments({ owner: traderId, status: "completed" }),
      orderBuyModel.countDocuments({ owner: traderId, status: "completed" }),
      orderModel.distinct("user"),
      orderBuyModel.distinct("user", { owner: traderId }),
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

      orderModel
        .find({ owner: traderId })
        .populate("user", "userName")
        .populate("car", "carbrand carname carmodel year")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("status totalPrice")
        .lean(),

      orderBuyModel
        .find({ owner: traderId })
        .populate("user", "userName")
        .populate("car", "carbrand carname carmodel year carprice")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("status")
        .lean(),
    ]);

    const allCustomerIds = new Set([
      ...uniqueRentCustomers.map(String),
      ...uniqueBuyCustomers.map(String),
    ]);

    const formattedRentOrders = recentRentOrders.map((order) => ({
      id: order._id,
      customerName: order.user?.userName || "",
      carTitle:
        `${order.car?.carbrand || ""} ${order.car?.carname || ""} ${order.car?.carmodel || ""} ${order.car?.year || ""}`.trim(),
      totalPrice: order.totalPrice,
      status: order.status,
    }));

    const formattedBuyOrders = recentBuyOrders.map((order) => ({
      id: order._id,
      customerName: order.user?.userName || "",
      carTitle:
        `${order.car?.carbrand || ""} ${order.car?.carname || ""} ${order.car?.carmodel || ""} ${order.car?.year || ""}`.trim(),
      totalPrice: order.car?.carprice || 0,
      status: order.status,
    }));

    return ok(res, {
      revenue: {
        rent: totalRentRevenue[0]?.total || 0,
        buy: totalBuyRevenue[0]?.total || 0,
        total:
          (totalRentRevenue[0]?.total || 0) + (totalBuyRevenue[0]?.total || 0),
      },
      activeRentals,
      pendingOrders: {
        rent: pendingRentOrders,
        buy: pendingBuyOrders,
        total: pendingRentOrders + pendingBuyOrders,
      },
      completedOrders: {
        rent: completedRentOrders,
        buy: completedBuyOrders,
        total: completedRentOrders + completedBuyOrders,
      },
      totalCustomers: allCustomerIds.size,
      reviews: {
        average: Number((reviewStats[0]?.avgRating || 0).toFixed(1)),
        total: reviewStats[0]?.totalReviews || 0,
      },
      recentRentOrders: formattedRentOrders,
      recentBuyOrders: formattedBuyOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const getRentCars = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { owner: traderId };
    if (req.query.isavailable) filter.isavailable = req.query.isavailable;

    const [total, cars] = await Promise.all([
      carModel.countDocuments(filter),
      carModel
        .find(filter)
        .select(
          "carbrand carname carmodel year location carprice Transmission seatCount carimage isavailable",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedCars = cars.map((car) => ({
      id: car._id,
      name: `${car.carbrand} ${car.carname}`,
      model: car.carmodel,
      year: car.year,
      image: Array.isArray(car.carimage) ? car.carimage[0] : car.carimage,
      location: car.location,
      price: car.carprice,
      specs: {
        transmission: car.Transmission,
        seats: car.seatCount,
      },
      status: car.isavailable,
    }));

    return ok(res, { total, page, limit, cars: formattedCars });
  } catch (error) {
    next(error);
  }
};

export const getBuyCars = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [total, cars] = await Promise.all([
      carbuymodel.countDocuments({ owner: traderId }),
      carbuymodel
        .find({ owner: traderId })
        .select(
          "carbrand carname carmodel year location carprice Transmission seatCount carimage isavailable",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedCars = cars.map((car) => ({
      id: car._id,
      name: `${car.carbrand} ${car.carname}`,
      model: car.carmodel,
      year: car.year,
      image: Array.isArray(car.carimage) ? car.carimage[0] : car.carimage,
      location: car.location,
      price: car.carprice,
      specs: {
        transmission: car.Transmission,
        seats: car.seatCount,
      },
      status: car.isavailable,
    }));

    return ok(res, { total, page, limit, cars: formattedCars });
  } catch (error) {
    next(error);
  }
};

export const getRentOrders = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { owner: traderId };
    if (req.query.status) filter.status = req.query.status;

    const [total, orders] = await Promise.all([
      orderModel.countDocuments(filter),
      orderModel
        .find(filter)
        .populate("user", "userName")
        .populate("car", "carmodel year")
        .select("startDate endDate totalPrice status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      customer: order.user?.userName || "",
      car: `${order.car?.carmodel || ""} ${order.car?.year || ""}`.trim(),
      startDate: order.startDate,
      endDate: order.endDate,
      totalPrice: order.totalPrice,
      status: order.status,
    }));

    return ok(res, { total, page, limit, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

export const getBuyOrders = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);


    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { owner: traderId };
    if (req.query.status) filter.status = req.query.status;

    const [total, orders] = await Promise.all([
      orderBuyModel.countDocuments(filter),
      orderBuyModel
        .find(filter)
        .populate("user", "userName")
        .populate("car", "carmodel year")
        .select("carprice createdAt status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      customer: order.user?.userName || "",
      car: `${order.car?.carmodel     || ""} ${order.car?.year || ""}`.trim(),
      carprice: order.carprice,
      createdAt: order.createdAt,
      status: order.status,
    }));

    return ok(res, { total, page, limit, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [rentCustomerIds, buyCustomerIds] = await Promise.all([
      orderModel.distinct("user", { owner: traderId }),
      orderBuyModel.distinct(
        "user", // With this:
        {
          $match: {
            $or: [
              { owner: traderId },
              { owner: req.user.id }, // match as string too
            ],
          },
        },
      ),
    ]);

    const allIds = [
      ...new Set([
        ...rentCustomerIds.map(String),
        ...buyCustomerIds.map(String),
      ]),
    ];

    const total = allIds.length;

    const customers = await userModel
      .find({ _id: { $in: allIds } })
      .select("userName email phone isActive")
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const [rentOrders, buyOrders, totalSpentRent, totalSpentBuy] =
          await Promise.all([
            orderModel.countDocuments({ user: customer._id, owner: traderId }),
            orderBuyModel.countDocuments({
              user: customer._id,
              owner: traderId,
            }),
            orderModel.aggregate([
              {
                $match: {
                  user: customer._id,
                  owner: traderId,
                  status: "completed",
                },
              },
              { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
            orderBuyModel.aggregate([
              {
                $match: {
                  user: customer._id,
                  owner: traderId,
                  status: "completed",
                },
              },
              { $group: { _id: null, total: { $sum: "$carprice" } } },
            ]),
          ]);

        return {
          id: customer._id,
          name: customer.userName,
          email: customer.email,
          phone: customer.phone,
          totalOrders: rentOrders + buyOrders,
          totalSpent:
            (totalSpentRent[0]?.total || 0) + (totalSpentBuy[0]?.total || 0),
        };
      }),
    );

    return ok(res, { total, page, limit, customers: formattedCustomers });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const traderCars = await carModel.distinct("_id", { owner: traderId });

    const filter = { carRent: { $in: traderCars } };
    if (req.query.rating) filter.rating = Number(req.query.rating);

    const [total, reviews, ratingStats] = await Promise.all([
      reviewModel.countDocuments(filter),

      reviewModel
        .find(filter)
        .populate("userId", "userName")
        .populate("carRent", "carbrand carname carmodel year")
        .select("rating comment createdAt userId carRent")
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
            total: { $sum: 1 },
            stars5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
            stars4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
            stars3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
            stars2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
            stars1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      customerId: review.userId?._id || "",
      customerName: review.userId?.userName || "",
      carId: review.carRent?._id || "",
      carTitle:
        `${review.carRent?.carbrand || ""} ${review.carRent?.carname || ""} ${review.carRent?.carmodel || ""} ${review.carRent?.year || ""}`.trim(),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
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
      reviews: formattedReviews,
    });
  } catch (error) {
    next(error);
  }
};
export const getAnalytics = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

   
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const RENT_ACTIVE_STATUSES = ["completed", "pending"];
    const BUY_ACTIVE_STATUSES = ["completed", "pending", "accepted"];
    const BUY_SUCCESS_STATUSES = ["completed", "accepted"];

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
      // Rent revenue monthly
      orderModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: { $in: RENT_ACTIVE_STATUSES },
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Buy revenue monthly
      orderBuyModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: { $in: BUY_ACTIVE_STATUSES },
            createdAt: { $gte: twelveMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$carprice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Rent order count monthly (all statuses)
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
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Buy order count monthly (all statuses)
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
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Status distribution — rent
      orderModel.aggregate([
        { $match: { owner: traderId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Status distribution — buy
      orderBuyModel.aggregate([
        { $match: { owner: traderId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Top 5 rent cars
      orderModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: { $in: RENT_ACTIVE_STATUSES },
          },
        },
        {
          $group: {
            _id: "$car",
            revenue: { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "carrents",
            localField: "_id",
            foreignField: "_id",
            as: "car",
          },
        },
        // ✅ FIXED: preserveNullAndEmptyArrays keeps orders even if car was deleted
        { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            revenue: 1,
            bookings: 1,
            "car.carbrand": 1,
            "car.carname": 1,
            "car.carmodel": 1,
            "car.carprice": 1,
          },
        },
      ]),

      // Top 5 buy cars
      orderBuyModel.aggregate([
        {
          $match: {
            owner: traderId,
            status: { $in: BUY_ACTIVE_STATUSES },
          },
        },
        {
          $group: {
            _id: "$car",
            sales: { $sum: 1 },
            revenue: { $sum: "$carprice" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "carbuys",
            localField: "_id",
            foreignField: "_id",
            as: "car",
          },
        },
        // ✅ FIXED: preserveNullAndEmptyArrays keeps orders even if car was deleted
        { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            sales: 1,
            revenue: 1,
            "car.carbrand": 1,
            "car.carname": 1,
            "car.carmodel": 1,
            "car.carprice": 1,
          },
        },
      ]),

      // Conversion rate — rent
      orderModel.aggregate([
        { $match: { owner: traderId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
          },
        },
      ]),

      // Conversion rate — buy
      orderBuyModel.aggregate([
        { $match: { owner: traderId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $in: ["$status", BUY_SUCCESS_STATUSES] }, 1, 0],
              },
            },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // Merge rent + buy into one revenue timeline
    const revenueMap = {};

    monthlyRentRevenue.forEach(({ _id, revenue, orders }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      if (!revenueMap[key])
        revenueMap[key] = {
          month: key,
          rentRevenue: 0,
          buyRevenue: 0,
          rentOrders: 0,
          buyOrders: 0,
        };
      revenueMap[key].rentRevenue = revenue;
      revenueMap[key].rentOrders = orders;
    });

    monthlyBuyRevenue.forEach(({ _id, revenue, orders }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      if (!revenueMap[key])
        revenueMap[key] = {
          month: key,
          rentRevenue: 0,
          buyRevenue: 0,
          rentOrders: 0,
          buyOrders: 0,
        };
      revenueMap[key].buyRevenue = revenue;
      revenueMap[key].buyOrders = orders;
    });

    const revenueTimeline = Object.values(revenueMap)
      .map((m) => ({ ...m, totalRevenue: m.rentRevenue + m.buyRevenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Format status distribution
    const formatStatus = (arr) =>
      arr.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

    // Conversion values
    const rentTotal = conversionRent[0]?.total || 0;
    const rentCompleted = conversionRent[0]?.completed || 0;
    const rentPending = conversionRent[0]?.pending || 0;

    const buyTotal = conversionBuy[0]?.total || 0;
    const buyCompleted = conversionBuy[0]?.completed || 0;
    const buyPending = conversionBuy[0]?.pending || 0;

    // Total revenue
    const totalRentRevenue = revenueTimeline.reduce(
      (sum, m) => sum + m.rentRevenue,
      0,
    );
    const totalBuyRevenue = revenueTimeline.reduce(
      (sum, m) => sum + m.buyRevenue,
      0,
    );
    const totalRevenue = totalRentRevenue + totalBuyRevenue;

    // Revenue mix
    const rentMixPercent =
      totalRevenue > 0
        ? +((totalRentRevenue / totalRevenue) * 100).toFixed(1)
        : 0;
    const buyMixPercent =
      totalRevenue > 0
        ? +((totalBuyRevenue / totalRevenue) * 100).toFixed(1)
        : 0;

    // Open demand = pending orders
    const openDemand = rentPending + buyPending;

    const overallConversionRate =
      rentTotal + buyTotal > 0
        ? +(
            ((rentCompleted + buyCompleted) / (rentTotal + buyTotal)) *
            100
          ).toFixed(1)
        : 0;

    return ok(res, {
      summary: {
        monthlyRevenue: totalRevenue,
        openDemand,
        conversionRate: overallConversionRate,
        totalRentRevenue,
        totalBuyRevenue,
      },
      revenueMix: {
        rentPercent: rentMixPercent,
        buyPercent: buyMixPercent,
      },
      revenueTimeline,
      orderVolume: {
        rent: monthlyRentOrders,
        buy: monthlyBuyOrders,
      },
      statusDistribution: {
        rent: formatStatus(statusDistributionRent),
        buy: formatStatus(statusDistributionBuy),
      },
      topPerformingCars: {
        rent: topRentCars,
        buy: topBuyCars,
      },
      conversionRate: {
        rent: rentTotal ? +((rentCompleted / rentTotal) * 100).toFixed(1) : 0,
        buy: buyTotal ? +((buyCompleted / buyTotal) * 100).toFixed(1) : 0,
        overall: overallConversionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);

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
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            rentEarnings: { $sum: "$totalPrice" },
            rentCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]),
    ]);

    const totalRent = totalEarningsRent[0]?.total || 0;
    const totalBuy = totalEarningsBuy[0]?.total || 0;
    const pendingRent = pendingRentRevenue[0]?.total || 0;
    const pendingBuy = pendingBuyRevenue[0]?.total || 0;

    return ok(res, {
      available: totalRent + totalBuy, // الرصيد المتاح (مكتمل)
      pending: pendingRent + pendingBuy, // الرصيد المعلق (accepted)
      total: totalRent + totalBuy + pendingRent + pendingBuy,
      breakdown: {
        rent: { earned: totalRent, pending: pendingRent },
        buy: { earned: totalBuy, pending: pendingBuy },
      },
      monthlyBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const traderId = new mongoose.Types.ObjectId(req.user.id);
    const limit = Number(req.query.limit) || 10;

    const [recentRentOrders, recentBuyOrders, recentReviews] =
      await Promise.all([
        orderModel
          .find({ owner: traderId })
          .populate("user", "userName avatar")
          .populate("car", "carbrand carname carimage")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),

        orderBuyModel
          .find({ owner: traderId })
          .populate("user", "userName avatar")
          .populate("car", "carbrand carname carimage")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),

        reviewModel
          .find({
            car: { $in: await carModel.distinct("_id", { owner: traderId }) },
          })
          .populate("user", "userName avatar")
          .populate("car", "carbrand carname")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
      ]);

    // دمج كل الأنشطة وترتيبها بالتاريخ
    const activities = [
      ...recentRentOrders.map((o) => ({ type: "rent_order", ...o })),
      ...recentBuyOrders.map((o) => ({ type: "buy_order", ...o })),
      ...recentReviews.map((r) => ({ type: "review", ...r })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return ok(res, { activities });
  } catch (error) {
    next(error);
  }
};
