import { CaretDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../../utils";
import type { IMenuItem } from "./_options";

const SideBarItems = ({ item }: { item: IMenuItem }) => {
  const location = useLocation();

  const isActive = (path: any) => {
    if (path.route === location.pathname) return true;
    if (path.children) {
      return path.children.some((child: any) => isActive(child));
    }
    return false;
  };
  const isItemActive = isActive(item);
  const [isMenuActive, setIsMenuActive] = useState(!isItemActive);
  useEffect(() => {
    if (isItemActive) {
      setIsMenuActive(false);
    }
  }, []);
  const handelClick = () => {
    return setIsMenuActive(!isMenuActive);
  };

  return (
    <li>
      <div
        onClick={handelClick}
        className={`${
          isItemActive ? "text-blue-400" : "text-white"
        } flex justify-between items-center cursor-pointer text-sm`}
      >
        {item.children || !item.route ? (
          <p className="flex items-center gap-3">
            {item.icon} {item.label}
          </p>
        ) : (
          <NavLink className={"w-full flex items-center gap-3"} to={item.route}>
            {item.icon} {item.label}
          </NavLink>
        )}
        {item.children && (
          <CaretDownOutlined
            className={`${
              !isMenuActive && "rotate-180"
            } opacity-75 duration-300`}
          />
        )}
      </div>
      {item.children && (
        <div
          className={cn(
            "transform transition-all duration-300 overflow-hidden",
            {
              "max-h-0 opacity-0": isMenuActive,
              "max-h-40 opacity-100": !isMenuActive,
            }
          )}
        >
          <ul className="ml-8 mt-4 flex flex-col gap-3 text-sm">
            {item.children.map((item, index) => (
              <li key={index}>
                <NavLink
                  end
                  to={item.route}
                  className={({ isActive }) =>
                    `${isActive ? "text-blue-400" : "text-white"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default SideBarItems;
