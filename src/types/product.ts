export interface ISize {
  value: string;
  stock: number;
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  thumbnail: string;
  images: string[];
  price: number;
  sold: number;
  sizes: ISize[];
  category: string;
  brand: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
