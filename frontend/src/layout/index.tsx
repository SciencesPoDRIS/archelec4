import { FC, PropsWithChildren } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);
