import instance from "../utils/api";

export const createOrder = async (body: any) => {
  const { data } = await instance.post("/order/create", body);
  return data;
};
