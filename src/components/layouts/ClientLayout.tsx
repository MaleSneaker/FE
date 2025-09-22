import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import { useEffect } from "react";

export default function ClientLayout() {
  useEffect(() => {
    localStorage.removeItem("shipping");
    localStorage.removeItem("note");
    localStorage.removeItem("items");
  }, []);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
