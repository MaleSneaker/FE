import instance from "../utils/api";

export const getMyCart = async (): Promise<any> => {
  const { data } = await instance.get(`/cart/my-cart`);
  return data;
};

export const addToCart = async ({
  productId,
  size,
  quantity,
}: {
  productId: string;
  size: string;
  quantity: number;
}) => {
  const data = await instance.post("/cart/add", { productId, size, quantity });
  return data;
};

export const removeCart = async ({
  productId,
  size,
}: {
  productId: string;
  size: string;
}) => {
  const data = await instance.patch("/cart/remove", { productId, size });
  return data;
};

export const updateQuantityCartItem = async ({
  productId,
  size,
  quantity,
}: {
  productId: string;
  size: string;
  quantity: string;
}) => {
  const data = await instance.patch("/cart/update-quantity", {
    productId,
    size,
    quantity,
  });
  return data;
};
