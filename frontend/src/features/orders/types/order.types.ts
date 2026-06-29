export interface OrderCar {
  _id: string;
  carbrand: string;
  carname: string;
  carprice: number;
  owner: string;
  carimage: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  isavailable: string;
}

export interface OrderUser {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Order {
  _id: string;
  car: OrderCar;
  user: OrderUser;
  owner: OrderUser;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  priceperDay?: number;
  totalPrice?: number;
  carprice?: number;
  status: OrderStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  car: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface GetOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export type OrderMode = "rent" | "sale";

export interface CreateBuyOrderRequest {
  car: string;
  notes?: string;
}

export interface CreateBuyOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface DeleteOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface CancelOrderRequest {
  id: string;
  cancellationReason?: string;
}

export interface UpdateOrderStatusRequest {
  id: string;
  status: Extract<OrderStatus, "accepted" | "rejected" | "completed">;
  rejectionReason?: string;
}
