import React, { useEffect, useRef, useState } from "react";

import { Header } from "./header";
import { Footer } from "./footer";
import { PlainObject } from "../types";

export const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
