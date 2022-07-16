import { AntdConfig } from "./AntdConfig";
import { ApolloConfig } from "./ApolloConfig";
import { MomentConfig } from "./MomentConfig";

export const AppConfig = ({ children }) => {
  return (
    <MomentConfig>
      <AntdConfig>
        <ApolloConfig>{children}</ApolloConfig>
      </AntdConfig>
    </MomentConfig>
  );
};
