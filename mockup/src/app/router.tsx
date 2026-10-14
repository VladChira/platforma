import {
  createBrowserRouter,
  createHashRouter,
  type RouteObject,
} from "react-router";
import { Layout } from "../components/layout/Layout";
import { HomePage } from "../pages/HomePage";
import { CountyPage } from "../pages/CountyPage";
import { ProjectPage } from "../pages/ProjectPage";
import { BulletinPage } from "../pages/BulletinPage";
import { ExplorePage } from "../pages/ExplorePage";
import { VerifyPage } from "../pages/VerifyPage";
import { NotFoundPage } from "../pages/NotFoundPage";
const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "judet/:countyId", element: <CountyPage /> },
      { path: "proiect/:projectId", element: <ProjectPage /> },
      { path: "buletin", element: <BulletinPage /> },
      { path: "exploreaza", element: <ExplorePage /> },
      { path: "verifica", element: <VerifyPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

// Pages servește fișiere statice fără fallback pentru rute. Prefixul fizic
// rămâne în BASE_URL; în modul hash nu se repetă și după caracterul #.
export const router =
  import.meta.env.MODE === "pages"
    ? createHashRouter(routes)
    : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
