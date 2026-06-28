// src/modules/dashboard/dashboard.route.js

import { Router } from "express";
import {
  getOverview,
  getRentCars,
  getBuyCars,
  getRentOrders,
  getBuyOrders,
  getCustomers,
  getReviews,
  getAnalytics,
  getEarnings,
  getRecentActivity,
} from "./dashboard.controller.js";
import { auth }  from "../../middleware/verifyToken.js";
import { isTrader }         from "../../middleware/isTrader.middleware.js";

const router = Router();

router.use(auth, isTrader);

router.get("/overview",        getOverview);
router.get("/rent-cars",       getRentCars);
router.get("/buy-cars",        getBuyCars);
router.get("/rent-orders",     getRentOrders);
router.get("/buy-orders",      getBuyOrders);
router.get("/customers",       getCustomers);
router.get("/reviews",         getReviews);
router.get("/analytics",       getAnalytics);
router.get("/earnings",        getEarnings);
router.get("/recent-activity", getRecentActivity);

export default router;