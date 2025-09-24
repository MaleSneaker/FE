import { Radio, type RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../utils";

interface PriceListProps {
  params: { [key: string]: string | number | undefined };
  handleUpdateParams: (key: string, value: string | number) => void;
}

const PriceList = ({ params, handleUpdateParams }: PriceListProps) => {
  const [value, setValue] = useState<string>(
    (params.selectPrice as string) || "all"
  );

  const priceOptions = [
    { value: "all", label: <span className="text-primary">Tất cả</span> },
    {
      value: "lte-500000",
      label: (
        <div className="text-primary text-sm">
          Nhỏ hơn <span>{formatCurrency(500000)}</span>
        </div>
      ),
    },
    {
      value: "gte-500000,lte-1000000",
      label: (
        <div className="text-primary text-sm">
          Từ <span>{formatCurrency(500000)}</span> -{" "}
          <span>{formatCurrency(1000000)}</span>
        </div>
      ),
    },
    {
      value: "gte-1500000,lte-2000000",
      label: (
        <div className="text-primary text-sm">
          Từ <span>{formatCurrency(1500000)}</span> -{" "}
          <span>{formatCurrency(2000000)}</span>
        </div>
      ),
    },
    {
      value: "gte-2000000,lte-3000000",
      label: (
        <div className="text-primary text-sm">
          Từ <span>{formatCurrency(2000000)}</span> -{" "}
          <span>{formatCurrency(3000000)}</span>
        </div>
      ),
    },
    {
      value: "gte-3000000",
      label: (
        <div className="text-primary text-sm">
          Lớn hơn <span>{formatCurrency(3000000)}</span>
        </div>
      ),
    },
  ];

  const handleChangeFilterPrice = (e: RadioChangeEvent) => {
    const targetValue = e.target.value;
    setValue(targetValue);

    switch (targetValue) {
      case "all":
        handleUpdateParams("price[gte]", "");
        handleUpdateParams("price[lte]", "");
        handleUpdateParams("selectPrice", "all");
        handleUpdateParams("page", 1);
        break;
      case "lte-500000":
        handleUpdateParams("price[gte]", "");
        handleUpdateParams("price[lte]", 500000);
        handleUpdateParams("selectPrice", "lte-500000");
        handleUpdateParams("page", 1);
        break;
      case "gte-500000,lte-1000000":
        handleUpdateParams("price[gte]", 500000);
        handleUpdateParams("price[lte]", 1000000);
        handleUpdateParams("selectPrice", "gte-500000,lte-1000000");
        handleUpdateParams("page", 1);
        break;
      case "gte-1500000,lte-2000000":
        handleUpdateParams("price[gte]", 1500000);
        handleUpdateParams("price[lte]", 2000000);
        handleUpdateParams("selectPrice", "gte-1500000,lte-2000000");
        handleUpdateParams("page", 1);
        break;
      case "gte-2000000,lte-3000000":
        handleUpdateParams("price[gte]", 2000000);
        handleUpdateParams("price[lte]", 3000000);
        handleUpdateParams("selectPrice", "gte-2000000,lte-3000000");
        handleUpdateParams("page", 1);
        break;
      case "gte-3000000":
        handleUpdateParams("price[gte]", 3000000);
        handleUpdateParams("price[lte]", "");
        handleUpdateParams("selectPrice", "gte-3000000");
        handleUpdateParams("page", 1);
        break;
      default:
        break;
    }
  };

  // Đồng bộ state local khi params.selectPrice thay đổi (ví dụ khi params thay đổi bên ngoài)
  useEffect(() => {
    if ((params.selectPrice as string) !== value) {
      setValue((params.selectPrice as string) || "all");
    }
  }, [params.selectPrice]);

  return (
    <div className="p-1">
      <Radio.Group
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
        value={value || "all"}
        onChange={handleChangeFilterPrice}
        options={priceOptions}
      />
    </div>
  );
};

export default PriceList;
