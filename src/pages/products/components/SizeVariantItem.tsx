import { memo } from "react";

type SizeVariantItemProps = {
  item: string;
  updateFilter?: any;
  activeValue: { [key: string]: string };
};

const SizeVariantItem = ({
  item,
  updateFilter,
  activeValue,
}: SizeVariantItemProps) => {
  return (
    <>
      <div
        onClick={() => updateFilter("sizes.value", item)}
        className={`flex h-8 cursor-pointer items-center ${
          activeValue["sizes.value"] === item
            ? "border-black"
            : "border-black/30 hover:border-black"
        } justify-center border bg-white px-4 py-1 duration-300 select-none hover:border-black`}
      >
        {item}
      </div>
    </>
  );
};

export default memo(SizeVariantItem);
