import { Redirect, Route, Switch } from "react-router-dom";
import { AllProducts, ConfigProduct, Dashboard, NoMatch, Settings } from "../pages";
import { paths } from "../constants";
import { Sider, Header } from "../layouts";
import { Layout } from "antd";

export const MainRoutes = () => {
  return (
    <Layout>
      <Header />

      <Layout>
        <Sider />

        <Layout.Content style={styles.container}>
          <Switch>
            <Route exact path={paths.DASHBOARD} component={Dashboard} />
            <Route exact path={paths.ALL_PRODUCTS} component={AllProducts} />
            <Route exact path={paths.NEW_PRODUCT} component={ConfigProduct} />
            <Route path={paths.ALL_PRODUCTS + "/:id"} component={ConfigProduct} />
            <Route exact path={paths.SETTINGS} component={Settings} />
            <Redirect exact from={paths.MAIN} to={paths.DASHBOARD} />
            <Route component={NoMatch} />
          </Switch>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

const styles = {
  container: {
    padding: 15,
  },
};
