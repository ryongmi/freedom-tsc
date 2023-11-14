import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Error404 from "../pages/error/Error404";
import Home from "../pages/user/Home";
import DashBoard from "../pages/admin/DashBoard";
import { loader as loginLoder } from "../components/auth/Login";
import { userLoader, adminLoader } from "../components/sider/AppSider";
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
import ManageAuth from "../pages/admin/auth/ManageAuth";
import ManageAuthLevelCondition from "../pages/admin/auth/ManageAuthLevelCondition";
import Post from "../pages/post/Post";
import PostContent from "../pages/post/PostContent";
import PostEditor from "../pages/post/PostEditor";

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
            path: "dashBoard",
            element: <DashBoard />,
          },
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
          {
            path: "manageAuth",
            element: <ManageAuth />,
          },
          {
            path: "manageAuthLevelCondition",
            element: <ManageAuthLevelCondition />,
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
          { path: "/post/edit", element: <PostEditor /> },
          { path: "/post/:menuId", element: <Post /> },
          { path: "/post/:menuId/:postId", element: <PostContent /> },
        ],
      },
    ],
    errorElement: <Error404 />,
  },
]);

export default router;
