import instance from "../utils/api";

export interface IProvince {
  _id: string;
  name: string;
}

export interface IWard extends IProvince {
  provinceName: string;
}

export const getAllProvince = async (): Promise<IProvince[]> => {
  const { data } = await instance.get("/shipping/province");
  return data.data;
};

export const getWard = async (id: string): Promise<IWard[]> => {
  const { data } = await instance.get(`/shipping/ward/${id}`);
  return data.data;
};
