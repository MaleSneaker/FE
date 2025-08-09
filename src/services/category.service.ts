import type { IResponse } from "../types/api";
import type { ICategory } from "../types/category";
import instance from "../utils/api";

export const getAllCategory = async (
  params?: any
): Promise<IResponse<ICategory[]>> => {
  const { data } = await instance.get("/categories/all", { params });
  return data.data;
};

export const createCategory = async (
  body: Omit<ICategory, "_id" | "createdAt" | "updatedAt">
) => {
  const { data } = await instance.post("/categories/create", body);
  return data;
};

export const getDetailCategory = async (id: string): Promise<ICategory> => {
  const { data } = await instance.get(`/categories/detail/${id}`);
  return data.data;
};

export const updateCategory = async (
  id: string,
  body: Omit<ICategory, "_id" | "createdAt" | "updatedAt">
) => {
  const { data } = await instance.patch(`/categories/update/${id}`, body);
  return data;
};
