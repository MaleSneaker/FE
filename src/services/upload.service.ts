import instance from "../utils/api";

export const uploadSingleFile = async (body: FormData) => {
  const res = await instance.post("/upload/single", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const uploadMutipleFile = async (body: FormData) => {
  const res = await instance.post("/upload/many", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
