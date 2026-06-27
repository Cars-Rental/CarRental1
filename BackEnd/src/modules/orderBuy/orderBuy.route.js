import express from "express";
import { auth , Authorization  } from "../../middleware/verifyToken.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  createOrderBuyValidation,
  orderIdParamValidation,
  updateOrderBuyStatusValidation,
  cancelOrderBuyValidation,
  getOrdersBuyQueryValidation,
} from "./orderBuy.validation.js";
import {
  createOrderBuy,
  getMyOrdersBuy,
  getOwnerOrdersBuy,
  getOrderBuyById,
  updateOrderBuyStatus,
  cancelOrderBuy,
  getAllOrdersBuy
} from "./orderBuy.contoller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  validation(createOrderBuyValidation),
  createOrderBuy,
);

router.get("/all", auth, Authorization("admin"), getAllOrdersBuy);

router.get(
  "/my-orders",
  auth,
  validation(getOrdersBuyQueryValidation),
  getMyOrdersBuy,
);

router.get(
  "/owner-orders",
  auth,
  validation(getOrdersBuyQueryValidation),
  getOwnerOrdersBuy,
);

router.get(
  "/:id",
  auth,
  validation(orderIdParamValidation),
  getOrderBuyById,
);

router.patch(
  "/:id/status",
  auth,
  validation(updateOrderBuyStatusValidation),
  updateOrderBuyStatus,
);

router.patch(
  "/:id/cancel",
  auth,
  validation(cancelOrderBuyValidation),
  cancelOrderBuy,
);

export default router;