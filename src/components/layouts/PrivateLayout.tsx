import { Outlet } from "react-router-dom";
import SideBar from "./sidebar/SideBar";

const PrivateLayout = () => {
  return (
    <div className="flex gap-6 " >
      <SideBar />
      <main className="w-full pr-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
