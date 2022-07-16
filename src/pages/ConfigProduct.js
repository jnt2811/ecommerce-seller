import { useHistory, useLocation, useParams } from "react-router-dom";
import { paths } from "../constants";
import { Topbar } from "../components";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import { ADD_PRODUCT, GET_PRODUCTS, UPDATE_PRODUCT } from "../queries/products.gql";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export const ConfigProduct = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isAddNew = pathname === paths.NEW_PRODUCT;
  const { currentUser } = useAuth();
  const [skip, setSkip] = useState(true);
  const [currentProduct, setCurrentProduct] = useState();
  const {
    data: item_data,
    loading: item_loading,
    error: item_error,
  } = useQuery(GET_PRODUCTS, { variables: { id }, skip });
  const [addProduct, { data: add_data, loading: add_loading, error: add_error, reset: add_reset }] =
    useMutation(ADD_PRODUCT);
  const [
    updateProduct,
    { data: update_data, loading: update_loading, error: update_error, reset: update_reset },
  ] = useMutation(UPDATE_PRODUCT);

  console.log("get product", item_data, item_loading, item_error);
  console.log("add new product", add_data, add_loading, add_error);
  console.log("update product", update_data, update_loading, update_error);

  useEffect(() => {
    if (!isAddNew && id) {
      setSkip(false);
    }
  }, [isAddNew, id]);

  useEffect(() => {
    if (add_data && add_data?.addNewProduct?.status === "OK") {
      notification.success({ message: "Add new product successfully", placement: "bottomLeft" });
      add_reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add_data]);

  useEffect(() => {
    if (update_data && update_data?.updateProduct?.status === "OK") {
      notification.success({ message: "Update product successfully", placement: "bottomLeft" });
      update_reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update_data]);

  useEffect(() => {
    if (item_data && item_data?.getProducts?.length === 1) {
      const product = item_data?.getProducts[0];
      form.setFields(Object.keys(product).map((name) => ({ name, value: product[name] })));
      setCurrentProduct(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item_data]);

  const onFinish = (values) => {
    values.SELLER_ID = currentUser.ID;

    if (isAddNew) {
      console.log("add product", values);
      addProduct({ variables: { products: [values] } });
    } else {
      values.ID = currentProduct.ID;
      console.log("edit product", values);
      updateProduct({ variables: { product: values } });
    }
  };

  return (
    <Spin spinning={item_loading}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Topbar
          title={(isAddNew ? "New" : "Edit") + " product"}
          showSearch={false}
          extraContent={
            <>
              <Form.Item
                noStyle
                name="PRODUCT_LOCK"
                rules={[{ required: true }]}
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={false}>Public</Radio>
                  <Radio value={true}>Private</Radio>
                </Radio.Group>
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={add_loading || update_loading}>
                Publish
              </Button>
            </>
          }
          onBack={() => history.push(paths.ALL_PRODUCTS)}
        />

        <Divider orientation="left">Basic Information</Divider>

        <Row gutter={10}>
          <Col span={8}>
            <Form.Item label="Product name" name="PRODUCT_NAME" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Category" name="CATEGORY_ID" rules={[{ required: true }]}>
              <Select style={{ width: "100%" }}>
                <Select.Option value="a">a</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Price" name="PRICE" rules={[{ required: true }]}>
              <InputNumber min={0} addonAfter="VND" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Product Description</Divider>

        <Form.Item label="Short Description" name="DESCRIPTION" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Detail Description" name="DETAILS" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Divider orientation="left">Media</Divider>
      </Form>
    </Spin>
  );
};
