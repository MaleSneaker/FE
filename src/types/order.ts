export interface IOrderItem {
  productId: string | {
    _id: string;
    name: string;
    thumbnail: string;
    images: string[];
    price: number;
    description?: string;
  };
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
  feeShipping: number;
  paymentMethod: 'cod' | 'online';
  isPaid: boolean;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'done' | 'cancelled';
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
  feeShipping?: number;
  paymentMethod?: 'cod' | 'online';
  totalPrice: number;
}

export interface IOrderStatusUpdate {
  orderId: string;
  status: IOrder['status'];
  notes?: string;
}