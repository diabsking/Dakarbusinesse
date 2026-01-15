import { Outlet } from "react-router-dom";
import NavbarHome from "../components/layout/NavbarHome";

export default function HomeLayout() {
  return (
    <>
      <NavbarHome />
      <Outlet />
    </>
  );
}
