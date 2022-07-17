import "antd/dist/antd.variable.min.css";
import { ConfigProvider } from "antd";
// import viVN from "antd/lib/locale/vi_VN";

ConfigProvider.config({
  theme: {
    primaryColor: "#4A5FC1",
  },
});

export const AntdConfig = ({ children }) => {
  return (
    <ConfigProvider
    // locale={viVN}
    >
      {children}
    </ConfigProvider>
  );
};
