import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Test1 from "../pages/Test1";
import Test2 from "../pages/Test2";
import Error404 from "../pages/error/Error404";
import Home from "../pages/user/Home";
import DashBoard from "../pages/admin/DashBoard";
import { loader as loginLoder } from "../components/Login";
import { userLoader, adminLoader } from "../layout/AppSider";
import AppContentLayout from "../layout/AppContentLayout";
import ManageMenu from "../pages/admin/menu/ManageMenu";
import DetailMenu from "../pages/admin/menu/DetailMenu";
import ManageBracket from "../pages/admin/bracket/ManageBracket";
import ManageUser from "../pages/admin/user/ManageUser";
import ManageWarnUser from "../pages/admin/user/ManageWarnUser";
import ContentWarnUser from "../pages/admin/user/ContentWarnUser";
import ContentBanUser from "../pages/admin/user/ContentBanUser";
import ManageBanUser from "../pages/admin/user/ManageBanUser";
import ManageComCd from "../pages/admin/com-cd/ManageComCd";
import DetailComCd from "../pages/admin/com-cd/DetailComCd";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    loader: loginLoder,
    children: [
      {
        path: "/admin",
        element: <AppContentLayout />,
        loader: adminLoader,
        children: [
          {
            path: "manageMenu",
            element: <ManageMenu />,
          },
          {
            path: "manageMenu/:topMenuId",
            element: <DetailMenu />,
          },
          {
            path: "manageBracket/:menuId",
            element: <ManageBracket />,
          },
          {
            path: "manageUser",
            element: <ManageUser />,
          },
          {
            path: "manageWarnUser",
            element: <ManageWarnUser />,
          },
          {
            path: "manageWarnUser/:userId",
            element: <ContentWarnUser />,
          },
          {
            path: "manageBanUser",
            element: <ManageBanUser />,
          },
          {
            path: "manageBanUser/:userId",
            element: <ContentBanUser />,
          },
          {
            path: "manageComCd",
            element: <ManageComCd />,
          },
          {
            path: "manageComCd/:comId",
            element: <DetailComCd />,
          },
        ],
      },
      {
        path: "/",
        element: <AppContentLayout />,
        loader: userLoader,
        children: [
          {
            index: true,
            element: <Home />,
          },
          { path: "/test1", element: <Test1 /> },
          //   { path: "/test2", element: <Menu />, loader: menuLoader },
          { path: "/test2", element: <Test2 /> },
          { path: "/admin", element: <DashBoard /> },
        ],
      },
      // { path: "/", element: <Home /> },
      // { path: "/test1", element: <Test1 /> },
      // //   { path: "/test2", element: <Menu />, loader: menuLoader },
      // { path: "/test2", element: <Test2 /> },
      // { path: "/admin", element: <DashBoard /> },
      //   {
      //     path: "/order/new",
      //     element: <CreateOrder />,
      //     action: createOrderAction,
      //   },
      //   { path: "/order/:orderId", element: <Order />, loader: orderLoader },
    ],
    errorElement: <Error404 />,
  },
]);

export default router;
