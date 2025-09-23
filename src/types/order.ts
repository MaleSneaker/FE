export interface IOrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface IUserInfo {
  name: string;
  email: string;
  phone: string;
}

export interface IAddress {
  province: string;
  ward: string;
  detail: string;
}

export interface ICanceled {
  by?: string;
  description?: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  customerInfo: IUserInfo;
  receiverInfo: IUserInfo;
  address: IAddress;
  items: IOrderItem[];
  note?: string;
  canceled?: ICanceled;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'done' | 'cancelled';
  paymentStatus?: 'unpaid' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: 'cod' | 'vnpay' | 'momo' | 'banking';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Additional interfaces for frontend display
export interface IOrderWithDetails extends IOrder {
  orderCode?: string;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
}

export interface ICreateOrderRequest {
  receiverInfo: IUserInfo;
  address: IAddress;
  items: IOrderItem[];
  note?: string;
  totalPrice: number;
}

export interface IOrderStatusUpdate {
  orderId: string;
  status: IOrder['status'];
  notes?: string;
}