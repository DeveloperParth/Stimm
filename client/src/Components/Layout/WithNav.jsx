import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navigations/Navbar";
import BottomNav from "../Navigations/BottomNav";
import SideBar from "../Navigations/SideBar";
import { useMantineTheme } from "@mantine/core";


function WithNav({ children }) {
  const theme = useMantineTheme();
  const [width, setWidth] = useState(window.innerWidth);
  let isMobile = theme.breakpoints.xs > width;
  let showSideBar = width > theme.breakpoints.md;
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <>
      {isMobile ? <BottomNav /> : <Navbar />}
      <Outlet />
      {showSideBar ? <SideBar /> : null}
    </>
  );
}

export default WithNav;
