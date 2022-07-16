import { DashboardOutlined, ShopOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useHistory } from "react-router-dom";
import { paths } from "../constants";

export const Sider = () => {
  const history = useHistory();

  const onChange = ({ key }) => history.push(key);

  return (
    <Layout.Sider style={styles.container}>
      <Menu items={items} theme="dark" mode="inline" onClick={onChange} />
    </Layout.Sider>
  );
};

const items = [
  {
    key: paths.DASHBOARD,
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "product_tab",
    label: "Products",
    icon: <ShopOutlined />,
    children: [
      {
        key: paths.ALL_PRODUCTS,
        label: "All products",
      },
      {
        key: paths.NEW_PRODUCT,
        label: "Add product",
      },
    ],
  },
];

const styles = {
  container: {
    height: "calc(100vh - 64px)",
    overflow: "auto",
  },
};
