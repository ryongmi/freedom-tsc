import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Test1 from "../pages/Test1";
import Test2 from "../pages/Test2";
import Error404 from "../pages/error/Error404";
import Home from "../pages/user/Home";
import DashBoard from "../pages/admin/DashBoard";
import { loader as loginLoder } from "../components/Login";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    loader: loginLoder,
    children: [
      { path: "/", element: <Home /> },
      { path: "/test1", element: <Test1 /> },
      //   { path: "/test2", element: <Menu />, loader: menuLoader },
      { path: "/test2", element: <Test2 /> },
      { path: "/admin", element: <DashBoard /> },
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
