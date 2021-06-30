import { Home } from "../pages/home";
import { Explore } from "../pages/explore";
import { Profession } from "../pages/profession";
import { FAQ } from "../pages/faq";
import { LegalNotice } from "../pages/legal-notice";
import { Credits } from "../pages/credits";
import { CollexPersee } from "../pages/collex-persee";

// Definition of a route
export interface RouteDefinition {
  path: string;
  redirect?: string;
  component?: any;
  exact?: boolean;
  routes?: RouteDefinition[];
}

export const routes: RouteDefinition[] = [
  {
    path: "",
    redirect: "/",
    routes: [
      {
        path: "/",
        component: Home,
      },
      {
        path: "/profession/:id",
        component: Profession,
      },
      {
        path: "/explorer",
        component: Explore,
      },
      {
        path: "/faq",
        component: FAQ,
      },
      {
        path: "/mentions-legales",
        component: LegalNotice,
      },
      {
        path: "/credits",
        component: Credits,
      },
      {
        path: "/collex-persee",
        component: CollexPersee,
      },
    ],
  },
];
