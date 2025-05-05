// Layout.js
import React from "react";
import Header from "../templates/Header";
import Footer from "../templates/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
