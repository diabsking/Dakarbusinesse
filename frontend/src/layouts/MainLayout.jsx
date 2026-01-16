import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
