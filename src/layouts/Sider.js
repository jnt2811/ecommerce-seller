import { DashboardOutlined, NotificationOutlined, ShopOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useHistory } from "react-router-dom";
import { paths } from "../constants";

const PRODUCT_TAB = "product_tab";

export const Sider = () => {
  const history = useHistory();

  const onChange = ({ key }) => history.push(key);

  return (
    <Layout.Sider style={styles.container}>
      <Menu
        items={items}
        theme="dark"
        mode="inline"
        onClick={onChange}
        defaultOpenKeys={[PRODUCT_TAB]}
      />
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
    key: PRODUCT_TAB,
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
      {
        key: paths.VOUCHERS,
        label: "All vouchers",
      },
    ],
  },
  {
    key: paths.ORDERS,
    label: "Orders",
    icon: <NotificationOutlined />,
  },
];

const styles = {
  container: {
    height: "calc(100vh - 64px)",
    overflow: "auto",
    position: "sticky",
    top: 64,
    zIndex: 10,
  },
};
