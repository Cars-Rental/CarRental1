import { Router } from "express";
import { auth, Authorization } from "../../middleware/verifyToken.js";

import { getOverview , getUsers,getUserById,deleteUser,banUser,unbanUser, getTraders,getTraderById,deleteTrader,banTrader,unbanTrader,approveTrader, getBookings,getBookingById,cancelBooking,

 getRentalCars,
  getRentalCarById,
  deleteRentalCar,
  suspendRentalCar,
  updateRentalCar,
  getSaleCars,
  getSaleCarById,
  deleteSaleCar,
  suspendSaleCar,
  updateSaleCar,
  getNotifications,
  createNotification,
  getOrders,
  getOrderById,
  cancelOrder,
   getReviews, deleteReview
 } from "../admin/admin.controller.js";

const router = Router();

router.use(auth, Authorization("Admin"));

router.get("/overview", getOverview);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/ban", banUser);
router.patch("/users/:id/unban", unbanUser);

router.get("/traders", getTraders);
router.get("/traders/:id", getTraderById);
router.delete("/traders/:id", deleteTrader);
router.patch("/traders/:id/ban", banTrader);
router.patch("/traders/:id/unban", unbanTrader);
router.patch("/traders/:id/approve", approveTrader);

router.get("/bookings", getBookings);
router.get("/bookings/:id", getBookingById);
router.patch("/bookings/:id/cancel", cancelBooking);

router.get("/cars/rent", getRentalCars);
router.get("/cars/rent/:id", getRentalCarById);
router.delete("/cars/rent/:id", deleteRentalCar);
router.patch("/cars/rent/:id/suspend", suspendRentalCar);
router.patch("/cars/rent/:id", updateRentalCar);


router.get("/cars/sale", getSaleCars);
router.get("/cars/sale/:id", getSaleCarById);
router.delete("/cars/sale/:id", deleteSaleCar);
router.patch("/cars/sale/:id/suspend", suspendSaleCar);
router.patch("/cars/sale/:id", updateSaleCar);


router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);


router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/cancel", cancelOrder);

router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview);


export default router;
