export const useGetCheckout = () => {
  const shippingRaw = localStorage.getItem("shipping");
  const itemsRaw = localStorage.getItem("items");
  const note = localStorage.getItem("note");
  const shipping = shippingRaw ? JSON.parse(shippingRaw) : {};
  const items = itemsRaw ? JSON.parse(itemsRaw) : [];

  const response = {
    receiverInfo: {
      name: shipping.name,
      email: shipping.email,
      phone: shipping.phone,
    },
    address: {
      province: shipping.province,
      ward: shipping.ward,
      detail: shipping.detail,
    },
    items: items.map((item: any) => {
      return {
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        size: item.size.value,
        quantity: item.quantity,
      };
    }),
    note: note,
    totalPrice:
      items?.reduce(
        (acc: any, curr: any) => acc + curr.product.price * curr.quantity,
        0
      ) + 30000,
  };
  return response;
};
