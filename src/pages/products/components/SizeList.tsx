import SizeVariantItem from "./SizeVariantItem";

const SizeList = ({
  params,
  updateParams,
}: {
  params: any;
  updateParams: (key: string, value: string) => void;
}) => {
  const sizeOptions = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
  ];
  return (
    <div className="p-1">
      <div className="grid grid-cols-4 gap-4">
        {sizeOptions.map((size) => (
          <SizeVariantItem
            key={size}
            updateFilter={updateParams}
            activeValue={params}
            item={size}
          />
        ))}
      </div>
    </div>
  );
};

export default SizeList;
