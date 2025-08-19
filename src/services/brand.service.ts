import type { IResponse } from "../types/api";
import type { IBrand } from "../types/brand";
import instance from "../utils/api";

export const getAllbrands = async (
  params?: any
): Promise<IResponse<IBrand[]>> => {
  const { data } = await instance.get("/brands/all", { params });
  return data.data;
};

export const createBrand = async (
  body: Omit<IBrand, "_id" | "createdAt" | "updatedAt">
) => {
  const { data } = await instance.post("/brands/create", body);
  return data;
};

export const getDetailBrand = async (id: string): Promise<IBrand> => {
  const { data } = await instance.get(`/brands/detail/${id}`);
  return data.data;
};

export const updateBrand = async (
  id: string,
  body: Omit<IBrand, "_id" | "createdAt" | "updatedAt">
) => {
  const { data } = await instance.patch(`/brands/update/${id}`, body);
  return data;
};
