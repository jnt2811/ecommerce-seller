import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space } from "antd";
import { useHistory } from "react-router-dom";
import { paths } from "../constants";
import { useAuth } from "../contexts/AuthContext";

const MENU_LOGOUT = "logout";

export const Header = () => {
  return (
    <Layout.Header style={styles.container}>
      <div style={styles.logo}>SELLER</div>

      <UserPopup>
        <Button type="primary" ghost shape="circle" size="large" icon={<UserOutlined />}></Button>
      </UserPopup>
    </Layout.Header>
  );
};

const UserPopup = ({ children }) => {
  const history = useHistory();
  const { setCurrentUser } = useAuth();

  const handleMenu = ({ key }) => {
    if (key === MENU_LOGOUT) return handleLogout();
    history.push(key);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser();
  };

  return (
    <Dropdown
      trigger="click"
      overlay={
        <div style={styles.popupWrapper}>
          <Space style={styles.popupWrapper.userInfo}>
            <Avatar size="large">Seller</Avatar>
            <div>Seller</div>
          </Space>
          <Menu
            items={items}
            mode="vertical"
            style={styles.popupWrapper.menu}
            onClick={handleMenu}
          />
        </div>
      }
    >
      {children}
    </Dropdown>
  );
};

const items = [
  {
    key: paths.SETTINGS,
    label: "Settings",
    icon: <SettingOutlined />,
  },
  {
    key: MENU_LOGOUT,
    label: "Logout",
    icon: <LogoutOutlined />,
  },
];

const styles = {
  container: {
    backgroundColor: "white",
    paddingInline: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
  },
  popupWrapper: {
    backgroundColor: "white",
    minWidth: 200,
    boxShadow: "0 0 10px #00000025",
    userInfo: {
      padding: "15px 15px 5px 15px",
    },
    menu: {
      boxShadow: "none",
    },
  },
};
