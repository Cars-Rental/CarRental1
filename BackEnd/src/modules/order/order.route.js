import { Router } from "express";
import *as orders from "../order/order.controller.js";
import * as ordervalidation from "../order/order.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { auth } from "../../middleware/verifyToken.js";

const router = Router();

router.use(auth);


router.post("/create", validation(ordervalidation.createOrderSchema), orders.createOrder);


router.get("/my", validation(ordervalidation.listOrdersSchema), orders.getMyOrders);


router.get("/owner", validation(ordervalidation.listOrdersSchema), orders.getOwnerOrders);


router.get("/:id",validation(ordervalidation.getOrderByIdSchema),orders.getOrderById);

router.patch("/:id/status", validation(ordervalidation.updateOrderStatusSchema), orders.updateOrderStatus);

router.patch("/:id/cancel", validation(ordervalidation.cancelOrderSchema), orders.cancelOrder);

export default router;