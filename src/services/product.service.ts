import { updateBrand } from "./brand.service";
import type { IResponse } from "../types/api";
import type { IProduct } from "../types/product";
import instance from "../utils/api";

export const getAllProduct = async (
  params?: any
): Promise<IResponse<IProduct[]>> => {
  const { data } = await instance.get("/products/all", { params });
  return data.data;
};

export const getDetailProduct = async (id: string): Promise<IProduct> => {
  const { data } = await instance.get(`/products/detail/${id}`);
  return data.data;
};

export const updateStatusProduct = async (id: string, status: boolean) => {
  const { data } = await instance.patch(`/products/delete/${id}`, { status });
  return data;
};

export const createProduct = async (
  body: Omit<IProduct, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) => {
  const res = await instance.post("/products/create", body);
  return res.data;
};

export const updateProduct = async (
  id: string,
  body: Omit<IProduct, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) => {
  const res = await instance.patch(`/products/update/${id}`, body);
  return res.data;
};
