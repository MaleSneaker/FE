import instance from "../utils/api";
import type { IResponse } from "../types/api";
import type { IOrder } from "../types/order";

export const createOrder = async (body: any) => {
  const { data } = await instance.post("/order/create", body);
  return data;
};

export const createPayment = async (body: any) => {
  const { data } = await instance.post("/order/create-payos", body);
  return data;
}
// User order APIs
export const getMyOrders = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await instance.get("/order/my-orders", { params });
  return data.data as IResponse<IOrder[]>;
};

export const getMyOrderDetail = async (orderId: string) => {
  const { data } = await instance.get(`/order/my-orders/${orderId}`);
  return data;
};

export const cancelMyOrder = async (orderId: string, body: { by: string; description: string }) => {
  const { data } = await instance.patch(`/order/cancel/${orderId}`, body);
  return data;
};

// Admin order APIs
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await instance.get("/order/all", { params });
  return data.data as IResponse<IOrder[]>;
};

export const getOrderDetail = async (orderId: string) => {
  const { data } = await instance.get(`/order/detail/${orderId}`);
  return data;
};

export const updateOrderStatus = async (orderId: string, body: { status: string }) => {
  const { data } = await instance.patch(`/order/update-status/${orderId}`, body);
  return data;
};

export const cancelOrder = async (orderId: string, body: { by: string; description: string }) => {
  const { data } = await instance.patch(`/order/cancel/${orderId}`, body);
  return data;
};
