import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { paths } from "../constants";
import { Login, Signup } from "../pages";
import { AuthRoute, PrivateRoute } from "./ConfigRoutes";
import { MainRoutes } from "./MainRoutes";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <AuthRoute exact path={paths.LOGIN} component={Login} />
        <AuthRoute exact path={paths.SIGNUP} component={Signup} />
        <PrivateRoute path={paths.MAIN} component={MainRoutes} />
      </Switch>
    </BrowserRouter>
  );
};
