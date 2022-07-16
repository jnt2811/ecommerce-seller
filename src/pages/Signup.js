import { useMutation } from "@apollo/client";
import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { keys } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { encrypt256 } from "../helpers";
import { ADD_SELLER } from "../queries";

export const Signup = () => {
  const [form] = Form.useForm();
  const [addSeller, { data: add_data, loading: add_loading, error: add_error }] =
    useMutation(ADD_SELLER);
  const [tempUserData, setTempUserData] = useState();
  const { setCurrentUser } = useAuth();

  console.log("add new seller", add_data, add_loading, add_error);

  useEffect(() => {
    if (add_data && add_data?.addNewSeller?.status === "OK") {
      console.log("SIGNUP SUCCESS!");
      form.resetFields();
      setCurrentUser(tempUserData);

      const token = add_data?.addNewSeller?.token;

      localStorage.setItem(keys.ACCESS_TOKEN, token);
      localStorage.setItem(keys.USER_INFO, JSON.stringify(tempUserData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add_data]);

  const onFinish = (values) => {
    delete values.CONFIRM;

    console.log(values);

    values.PASSWORD = encrypt256(values.PASSWORD);

    setTempUserData(values);

    addSeller({ variables: { sellers: [values] } });
  };

  return (
    <Row>
      <Col span={12}></Col>

      <Col span={12} style={styles.main}>
        <Typography.Title>Signup now</Typography.Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Seller name" name="SELLER_NAME" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="EMAIL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Phone number" name="PHONE_NUMBER" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Main category" name="MAIN_CATEGORIES" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="a">a</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Password" name="PASSWORD" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="CONFIRM"
            hasFeedback
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("PASSWORD") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password autoComplete="false" />
          </Form.Item>

          <Button block type="primary" htmlType="submit" loading={add_loading}>
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
