import { CheckOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../../services/category.service";
import type { ICategory } from "../../../types/category";

const FilterSideBar = ({
  query,
  updateParams,
}: {
  query: any;
  updateParams: (key: string, value: string) => void;
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllCategory({ limit: 10000 });
        setCategories(data.docs);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <span className="block text-base font-medium">Danh mục</span>
      <div className="mt-4">
        {categories?.map((category) => (
          <div
            key={category._id}
            onClick={() => updateParams("category", category._id)}
            className="mt-2"
          >
            <span
              className={`block cursor-pointer text-sm font-bold capitalize`}
            >
              {category.name}
              {query?.category === category._id ? <CheckOutlined className="ml-1" /> : ""}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default FilterSideBar;
