import { userModel } from "../../DB/model/user.model.js";
import { carModel } from "../../DB/model/carRent.model.js";
import { carbuymodel } from "../../DB/model/carBuy.model.js";
import { orderModel } from "../../DB/model/order.model.js";
import { orderBuyModel } from "../../DB/model/orderBuy.model.js";
import { toDisplayId } from "../../utlis/displayId.util.js";
import { getTraderStats, getTraderStatsBulk } from "../../utlis/traderStats.util.js";
import { ok ,notFound , created, fail } from "../../utlis/response.util.js";
import { notificationModel } from "../../DB/model/notification.model.js";
import { NOTIFICATION_TYPES } from "../../constants/notification.types.js";
import { reviewModel } from "../../DB/model/review.model.js";
const COMMISSION_RATE = 0.1; 




export const getOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalTraders,
      activeRentalCars,
      carsForSale,
      totalBookings,
      totalOrders,
      monthlyRentRevenueAgg,
      monthlySaleRevenueAgg,
      recentUsers,
      recentTraders,
      recentBookings,
      recentOrders,
    ] = await Promise.all([
      userModel.countDocuments({ role: "User" }),
      userModel.countDocuments({ role: "Trader" }),
      carModel.countDocuments({ isavailable: "avilable" }),
      carbuymodel.countDocuments({ status: "available" }),
      orderModel.countDocuments(),
      orderBuyModel.countDocuments(),
      orderModel.aggregate([
        {
          $match: {
            status: { $in: ["accepted", "completed"] },
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      orderBuyModel.aggregate([
        {
          $match: {
            status: { $in: ["accepted", "completed"] },
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$carprice" } } },
      ]),
      userModel
        .find({ role: "User" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("userName isBanned")
        .lean(),
      userModel
        .find({ role: "Trader" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("userName isBanned")
        .lean(),
      orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "userName")
        .select("user status")
        .lean(),
      orderBuyModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "userName")
        .select("user status")
        .lean(),
    ]);

    const monthlyRevenue =
      (monthlyRentRevenueAgg[0]?.total || 0) + (monthlySaleRevenueAgg[0]?.total || 0);
    const platformCommission = Math.round(monthlyRevenue * COMMISSION_RATE);

    return ok(res, {
      stats: {
        totalUsers,
        totalTraders,
        activeRentalCars,
        carsForSale,
        totalBookings,
        totalOrders,
        monthlyRevenue,
        platformCommission,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u._id,
        name: u.userName,
        status: u.isBanned ? "banned" : "active",
      })),
      recentTraders: recentTraders.map((t) => ({
        id: t._id,
        name: t.userName,
        status: t.isBanned ? "banned" : "active",
      })),
      recentBookings: recentBookings.map((b) => ({
        id: toDisplayId("BK", b._id),
        customerName: b.user?.userName || "",
        status: b.status,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: toDisplayId("ORD", o._id),
        customerName: o.user?.userName || "",
        status: o.status,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = { role: "User" };

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "banned") filter.isBanned = true;
    if (status === "active") filter.isBanned = false;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      userModel
        .find(filter)
        .select("userName email phone isBanned createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      userModel.countDocuments(filter),
    ]);

    return ok(res, {
      users: users.map((u) => ({
        id: u._id,
        name: u.userName,
        email: u.email,
        phone: u.phone,
        status: u.isBanned ? "banned" : "active",
        createdAt: u.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findOne({ _id: id, role: "User" })
      .select("userName email phone isBanned createdAt")
      .lean();

    if (!user) return notFound(res, "المستخدم غير موجود");

    const [totalBookings, totalOrders] = await Promise.all([
      orderModel.countDocuments({ user: id }),
      orderBuyModel.countDocuments({ user: id }),
    ]);

    return ok(res, {
      id: user._id,
      name: user.userName,
      email: user.email,
      phone: user.phone,
      status: user.isBanned ? "banned" : "active",
      createdAt: user.createdAt,
      totalBookings,
      totalOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.findOneAndDelete({ _id: id, role: "User" });

    if (!deleted) return notFound(res, "المستخدم غير موجود");

    return ok(res, null, "تم حذف المستخدم بنجاح");
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findOneAndUpdate({ _id: id, role: "User" }, { isBanned: true }, { new: true })
      .select("userName email isBanned");

    if (!user) return notFound(res, "المستخدم غير موجود");

    return ok(res, user, "تم حظر المستخدم");
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findOneAndUpdate({ _id: id, role: "User" }, { isBanned: false }, { new: true })
      .select("userName email isBanned");

    if (!user) return notFound(res, "المستخدم غير موجود");

    return ok(res, user, "تم تفعيل المستخدم");
  } catch (error) {
    next(error);
  }
};






export const getTraders = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = { role: "Trader" };

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "banned") filter.isBanned = true;
    if (status === "active") filter.isBanned = false;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [traders, total] = await Promise.all([
      userModel
        .find(filter)
        .select("userName email phone isBanned createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      userModel.countDocuments(filter),
    ]);

    const statsMap = await getTraderStatsBulk(traders.map((t) => t._id));

    const data = traders.map((t) => {
      const stats = statsMap.get(t._id.toString()) || { carsCount: 0, earnings: 0 };
      return {
        id: t._id,
        businessName: t.userName,
        ownerName: t.userName,
        email: t.email,
        phone: t.phone,
        status: t.isBanned ? "banned" : "active",
        carsCount: stats.carsCount,
        earnings: stats.earnings,
        joinedAt: t.createdAt,
      };
    });

    return ok(res, {
      traders: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTraderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trader = await userModel
      .findOne({ _id: id, role: "Trader" })
      .select("userName email phone isBanned createdAt")
      .lean();

    if (!trader) return notFound(res, "التاجر غير موجود");

    const stats = await getTraderStats(trader._id);

    return ok(res, {
      id: trader._id,
      businessName: trader.userName,
      ownerName: trader.userName,
      email: trader.email,
      phone: trader.phone,
      status: trader.isBanned ? "banned" : "active",
      carsCount: stats.carsCount,
      rentCarsCount: stats.rentCarsCount,
      saleCarsCount: stats.saleCarsCount,
      earnings: stats.earnings,
      joinedAt: trader.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userModel.findOneAndDelete({ _id: id, role: "Trader" });

    if (!deleted) return notFound(res, "التاجر غير موجود");

    return ok(res, null, "تم حذف التاجر بنجاح");
  } catch (error) {
    next(error);
  }
};

export const banTrader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trader = await userModel
      .findOneAndUpdate({ _id: id, role: "Trader" }, { isBanned: true }, { new: true })
      .select("userName email isBanned");

    if (!trader) return notFound(res, "التاجر غير موجود");

    return ok(res, trader, "تم حظر التاجر");
  } catch (error) {
    next(error);
  }
};

export const unbanTrader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trader = await userModel
      .findOneAndUpdate({ _id: id, role: "Trader" }, { isBanned: false }, { new: true })
      .select("userName email isBanned");

    if (!trader) return notFound(res, "التاجر غير موجود");

    return ok(res, trader, "تم تفعيل التاجر");
  } catch (error) {
    next(error);
  }
};

export const approveTrader = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trader = await userModel
      .findOneAndUpdate({ _id: id, role: "Trader" }, { isBanned: false }, { new: true })
      .select("userName email isBanned");

    if (!trader) return notFound(res, "التاجر غير موجود");

    return ok(res, trader, "تم قبول تسجيل التاجر");
  } catch (error) {
    next(error);
  }
};





export const getBookings = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // السيرش بالاسم بيتطلب post-filter لأنه على populated field
    // لو الداتا كبيرة جدًا، الأفضل تستخدم aggregate + $lookup بدل ده
    const allMatching = await orderModel
      .find(filter)
      .populate("user", "userName")
      .populate("owner", "userName")
      .populate("car", "carname carmodel carbrand")
      .sort({ createdAt: -1 })
      .lean();

    let filtered = allMatching;
    if (search) {
      const q = search.toLowerCase();
      filtered = allMatching.filter(
        (b) =>
          toDisplayId("BK", b._id).toLowerCase().includes(q) ||
          b.user?.userName?.toLowerCase().includes(q) ||
          b.owner?.userName?.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    const data = paginated.map((b) => ({
      id: b._id,
      idBk: toDisplayId("BK", b._id),
      customerName: b.user?.userName || "",
      traderName: b.owner?.userName || "",
      carTitle: b.car ? `${b.car.carbrand} ${b.car.carname}` : "",
      carModel: b.car?.carmodel || "",
      startDate: b.startDate,
      endDate: b.endDate,
      totalDays: b.totalDays,
      priceperDay: b.priceperDay,
      totalPrice: b.totalPrice,
      status: b.status,
    }));

    return ok(res, {
      bookings: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await orderModel
      .findById(id)
      .populate("user", "userName email phone")
      .populate("owner", "userName email phone")
      .populate("car")
      .lean();

    if (!booking) return notFound(res, "الحجز غير موجود");

    return ok(res, { ...booking, displayId: toDisplayId("BK", booking._id) });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body || {};

    const booking = await orderModel.findByIdAndUpdate(
      id,
      { status: "cancelled", ...(cancellationReason && { cancellationReason }) },
      { new: true }
    );

    if (!booking) return notFound(res, "الحجز غير موجود");

    return ok(res, booking, "تم إلغاء الحجز");
  } catch (error) {
    next(error);
  }
};




export const getRentalCars = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { carname: { $regex: search, $options: "i" } },
        { carbrand: { $regex: search, $options: "i" } },
        { Body_Type: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "active") filter.isavailable = "avilable";
    if (status === "suspended" || status === "registered") filter.isavailable = "regestred";

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      carModel
        .find(filter)
        .populate("owner", "userName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      carModel.countDocuments(filter),
    ]);

    const data = cars.map((c) => ({
      id: c._id,
      title: `${c.carbrand} ${c.carname} ${c.carmodel}`,
      image: c.carimage?.[0]?.secure_url || null,
      location: c.location,
      traderName: c.owner?.userName || "",
      category: c.Body_Type,
      price: c.carprice,
      status: c.isavailable,
      fuel: c.fuel,
      transmission: c.Transmission,
      seatCount: c.seatCount,
    }));

    return ok(res, {
      cars: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalCarById = async (req, res, next) => {
  try {
    const car = await carModel.findById(req.params.id).populate("owner", "userName email phone");
    if (!car) return notFound(res, "السيارة غير موجودة");
    return ok(res, car);
  } catch (error) {
    next(error);
  }
};

export const deleteRentalCar = async (req, res, next) => {
  try {
    const deleted = await carModel.findByIdAndDelete(req.params.id);
    if (!deleted) return notFound(res, "السيارة غير موجودة");
    return ok(res, null, "تم حذف السيارة بنجاح");
  } catch (error) {
    next(error);
  }
};


export const suspendRentalCar = async (req, res, next) => {
  try {
    const car = await carModel.findByIdAndUpdate(
      req.params.id,
      { isavailable: "regestred" },
      { new: true }
    );
    if (!car) return notFound(res, "السيارة غير موجودة");
    return ok(res, car, "تم إيقاف السيارة");
  } catch (error) {
    next(error);
  }
};

export const updateRentalCar = async (req, res, next) => {
  try {
    const allowedFields = [
      "carbrand", "carname", "carmodel", "year", "location", "distance",
      "carprice", "fuel", "seatCount", "Body_Type", "Transmission", "isavailable",
    ];

    const updates = {};
    const body = req.body || {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    // allowedFields.forEach((field) => {
    //   if (req.body[field] !== undefined) updates[field] = req.body[field];
    // });

    const car = await carModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!car) return notFound(res, "السيارة غير موجودة");
    return ok(res, car, "تم تعديل السيارة");
  } catch (error) {
    next(error);
  }
};





export const getSaleCars = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { carname: { $regex: search, $options: "i" } },
        { carbrand: { $regex: search, $options: "i" } },
        { Body_Type: { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      carbuymodel
        .find(filter)
        .populate("owner", "userName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      carbuymodel.countDocuments(filter),
    ]);

    const data = cars.map((c) => ({
      id: c._id,
      title: `${c.carbrand} ${c.carname} ${c.carmodel}`,
      image: c.carimage?.[0]?.secure_url || null,
      location: c.location,
      traderName: c.owner?.userName || "",
      category: c.Body_Type,
      price: c.carprice,
      status: c.status,
      quantity: c.quantity,
    }));

    return ok(res, {
      cars: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSaleCarById = async (req, res, next) => {
  try {
    const car = await carbuymodel.findById(req.params.id).populate("owner", "userName email phone");
    if (!car) return notFound(res, "السيارة غير موجودة");
    return ok(res, car);
  } catch (error) {
    next(error);
  }
};

export const deleteSaleCar = async (req, res, next) => {
  try {
    const deleted = await carbuymodel.findByIdAndDelete(req.params.id);
    if (!deleted) return notFound(res, "السيارة غير موجودة");
    return ok(res, null, "تم حذف السيارة بنجاح");
  } catch (error) {
    next(error);
  }
};

export const suspendSaleCar = async (req, res, next) => {
  try {
    const car = await carbuymodel.findById(req.params.id);
    if (!car) return notFound(res, "السيارة غير موجودة");

    car.quantity = 0;
    await car.save();

    return ok(res, car, "تم إيقاف السيارة");
  } catch (error) {
    next(error);
  }
};

export const updateSaleCar = async (req, res, next) => {
  try {
    const allowedFields = [
      "carbrand", "carmodel", "year", "location", "carname", "carprice",
      "distance", "fuel", "seatCount", "Body_Type", "Transmission", "quantity", "status",
    ];

    const car = await carbuymodel.findById(req.params.id);
    if (!car) return notFound(res, "السيارة غير موجودة");

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) car[field] = req.body[field];
    });

    await car.save(); // save() مش findByIdAndUpdate عشان الـ pre-save hook يشتغل

    return ok(res, car, "تم تعديل السيارة");
  } catch (error) {
    next(error);
  }
};




export const getNotifications = async (req, res, next) => {
  try {
    const { audience, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (audience === "users") filter["metadata.audience"] = "users";
    if (audience === "traders") filter["metadata.audience"] = "traders";

    const [notifications, total] = await Promise.all([
      notificationModel
        .find(filter)
        .populate("recipient", "userName role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      notificationModel.countDocuments(filter),
    ]);

    const data = notifications.map((n) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      audience: n.recipient?.role === "Trader" ? "trader" : "user",
      recipientName: n.recipient?.userName || "",
      createdAt: n.createdAt,
      status: n.isRead ? "read" : "sent",
    }));

    return ok(res, {
      notifications: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const createNotification = async (req, res, next) => {
  try {
    const { title, message, audience } = req.body;

    if (!title || !message || !audience) {
      return fail(res, "البيانات ناقصة: title, message, audience مطلوبين", 400);
    }

    const roleFilter =
      audience === "users" ? { role: "User" } : audience === "traders" ? { role: "Trader" } : {};

    const recipients = await userModel.find(roleFilter).select("_id");

    const notifications = await notificationModel.insertMany(
      recipients.map((r) => ({
        recipient: r._id,
        sender: req.userId || null,
        type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
        title,
        message,
        metadata: { audience },
      }))
    );

    return created(res, { count: notifications.length }, "تم إرسال الإشعار");
  } catch (error) {
    next(error);
  }
};




export const getOrders = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const allMatching = await orderBuyModel
      .find(filter)
      .populate("user", "userName")
      .populate("owner", "userName")
      .populate("car", "carname carmodel carbrand")
      .sort({ createdAt: -1 })
      .lean();

    let filtered = allMatching;
    if (search) {
      const q = search.toLowerCase();
      filtered = allMatching.filter(
        (o) =>
          toDisplayId("ORD", o._id).toLowerCase().includes(q) ||
          o.user?.userName?.toLowerCase().includes(q) ||
          o.owner?.userName?.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    const data = paginated.map((o) => ({
      id: o._id,
      id_ORD: toDisplayId("ORD", o._id),
      customerName: o.user?.userName || "",
      traderName: o.owner?.userName || "",
      carTitle: o.car ? `${o.car.carbrand} ${o.car.carname}` : "",
      carModel: o.car?.carmodel || "",
      price: o.carprice,
      status: o.status,
    }));

    return ok(res, {
      orders: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderBuyModel
      .findById(id)
      .populate("user", "userName email phone")
      .populate("owner", "userName email phone")
      .populate("car")
      .lean();

    if (!order) return notFound(res, "الطلب غير موجود");

    return ok(res, { ...order, displayId: toDisplayId("ORD", order._id) });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body || {};

    const order = await orderBuyModel.findByIdAndUpdate(
      id,
      { status: "cancelled", ...(cancellationReason && { cancellationReason }) },
      { new: true }
    );

    if (!order) return notFound(res, "الطلب غير موجود");

    return ok(res, order, "تم إلغاء الطلب");
  } catch (error) {
    next(error);
  }
};




export const getReviews = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const allReviews = await reviewModel
      .find()
      .populate("userId", "userName")
      .populate("carRent", "carname carmodel carbrand")
      .sort({ createdAt: -1 })
      .lean();

    let filtered = allReviews;
    if (search) {
      const q = search.toLowerCase();
      filtered = allReviews.filter(
        (r) =>
          r.userId?.userName?.toLowerCase().includes(q) ||
          r.carRent?.carname?.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    const data = paginated.map((r) => ({
      id: r._id,
      customerName: r.userId?.userName || "",
      carTitle: r.carRent ? `${r.carRent.carbrand} ${r.carRent.carname}` : "",
      carModel: r.carRent?.carmodel || "",
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
    }));

    return ok(res, {
      reviews: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await reviewModel.findByIdAndDelete(id);

    if (!deleted) return notFound(res, "التقييم غير موجود");

    return ok(res, null, "تم حذف التعليق بنجاح");
  } catch (error) {
    next(error);
  }
};
