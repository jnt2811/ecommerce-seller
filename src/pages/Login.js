import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, notification, Row, Typography } from "antd";
import { useEffect } from "react";
import { keys } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { encrypt256 } from "../helpers";
import { LOGIN_SELLER } from "../queries";

export const Login = () => {
  const [form] = Form.useForm();
  const { setCurrentUser } = useAuth();
  const [login, { data: login_data, loading: login_loading, error: login_error }] =
    useMutation(LOGIN_SELLER);

  console.log("login seller", login_data, login_loading, login_error);

  useEffect(() => {
    if (login_data) {
      if (login_data?.sellerLogin?.status === "OK") {
        console.log("LOGIN SUCCESS!");
        form.resetFields();

        const token = login_data?.sellerLogin?.token;
        const user_info = login_data?.sellerLogin?.seller;

        setCurrentUser(user_info);

        localStorage.setItem(keys.ACCESS_TOKEN, token);
        localStorage.setItem(keys.USER_INFO, JSON.stringify(user_info));

        notification.success({ message: "Login success" });
      } else {
        console.log("LOGIN FAILED!");
        notification.error({ message: login_data?.sellerLogin?.message });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login_data]);

  const onFinish = (values) => {
    console.log(values);

    values.password = encrypt256(values.password);

    login({ variables: values });
  };

  return (
    <Row>
      <Col span={12}></Col>

      <Col span={12} style={styles.main}>
        <Typography.Title>Login now</Typography.Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email or Phone number" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Button block type="primary" htmlType="submit" loading={login_loading}>
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

const styles = {
  main: {
    height: "100vh",
    oveflow: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: "calc((100vw - 1000px)/2)",
  },
};
