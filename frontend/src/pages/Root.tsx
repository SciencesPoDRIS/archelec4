import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./home";
import { Explore } from "./explore";
import { Profession } from "./profession";
import { FAQ } from "./faq";
import { LegalNotice } from "./legal-notice";
import { Credits } from "./credits";
import { CollexPersee } from "./collex-persee";
import { Layout } from "../layout";

export const Root: FC = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/profession/:id" element={<Profession />} />
        <Route path="/explorer" element={<Explore />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/mentions-legales" element={<LegalNotice />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/collex-persee" element={<CollexPersee />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
