import { paths } from "../constants";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AuthRoute = ({ component: Component, ...remainingProps }) => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  return (
    <Route
      {...remainingProps}
      render={(props) => {
        return isAuth ? <Redirect to={paths.MAIN} /> : <Component {...props} />;
      }}
    />
  );
};

export const PrivateRoute = ({ component: Component, ...remainingProps }) => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  return (
    <Route
      {...remainingProps}
      render={(props) => {
        return isAuth ? <Component {...props} /> : <Redirect to={paths.LOGIN} />;
      }}
    />
  );
};
