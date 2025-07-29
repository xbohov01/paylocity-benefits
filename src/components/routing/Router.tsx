import { RouterProvider, createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import HomeRedirect from "./HomeRedirect";
import AuthLayout from "./layout/AuthLayout";
import Login from "../login/Login";
import DefaultLayout from "./layout/DefaultLayout";
import { useAuth } from "../context/auth/useAuth";
import { useMemo } from "react";
import MyBenefits from "../me/MyBenefits";
import MySettings  from "../me/MySettings";
import UserList from "../manage/UserList";
import CreateUser from "../manage/CreateUser";
import UserBenefits from "../manage/UserBenefits";
import EditUser from "../manage/EditUser";

// using routing for simplicity
// could be done as a SPA with tabs and such

// also as is this will log the user out on refresh
// could be fixed by storing a refresh token and refreshing the session on reload
// also might want to store last location into localstorage and send the user there after refresh

export default function Router() {
  const { user } = useAuth();

  const userHasFunction = (functionName: string) => {
    if (user == null) return false;
    return functionName == "" || user.functions.includes(functionName);
  };

  const router = useMemo(() => {
    const routes: RouteObject[] = [
      {
        path: "/",
        element: <HomeRedirect />,
      },
      {
        path: "/login",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },

      ...(userHasFunction("")
        ? [
            {
              path: "/me",
              element: <DefaultLayout />,
              children: [
                {
                  index: true,
                  element: <MyBenefits />,
                },
                // Leaving this one unused because of time constraits but could be used to see a cost breakdown per calculation
                {
                  path: "detail/:calculationId",
                  element: <>calculation</>,
                },
                {
                  path: "settings",
                  element: <MySettings />,
                },
              ],
            },
          ]
        : []),

      ...(userHasFunction("ViewUsers")
        ? [
            {
              path: "/manage",
              element: <DefaultLayout />,
              children: [
                {
                  index: true,
                  element: <UserList />,
                },
                {
                  path: "user/:userId/calculations",
                  element: <UserBenefits />,
                },
                {
                  path: "user/:userId/settings",
                  element: <EditUser/>,
                },
                // Making this a separate path since I'm guessing it would be some kind of a wizard where documents and stuff are submitted
                {
                  path: "user/create",
                  element: <CreateUser />,
                },
                // Leaving this one unused because of time constraits but could be used to see a cost breakdown per calculation
                {
                  path: "user/:userId/calculations/detail/:calculationId",
                  element: <>calculation</>,
                },
              ],
            },
          ]
        : []),

      // Catch all in case above are not matched
      {
        path: "*",
        element: <HomeRedirect />,
      },
    ];
    return createBrowserRouter(routes);
  }, [user]);

  return <RouterProvider router={router} />;
}
