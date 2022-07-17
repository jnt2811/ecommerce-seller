import { useHistory, useLocation, useParams } from "react-router-dom";
import { keys, paths } from "../constants";
import { TextEditor, Topbar, UploadGallery } from "../components";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  Spin,
} from "antd";
import {
  ADD_PRODUCT,
  ADD_VOUCHER_REF,
  GET_PRODUCTS,
  MULTIPLE_UPLOAD,
  UPDATE_PRODUCT,
} from "../queries/products.gql";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_CATEGORIES, GET_VOUCHERS } from "../queries";
import { currencyParser, formatNumberToPrice } from "../helpers";
import { nanoid } from "nanoid";

export const ConfigProduct = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isAddNew = pathname === paths.NEW_PRODUCT;
  const { currentUser } = useAuth();
  const vouchersValue = Form.useWatch(["VOUCHERS"], form);
  const [skip, setSkip] = useState(true);
  const [currentProduct, setCurrentProduct] = useState();
  const [fileList, setFileList] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const {
    data: item_data,
    loading: item_loading,
    error: item_error,
  } = useQuery(GET_PRODUCTS, { variables: { id }, skip, fetchPolicy: "no-cache" });
  const [addProduct, { data: add_data, loading: add_loading, error: add_error, reset: add_reset }] =
    useMutation(ADD_PRODUCT, { fetchPolicy: "no-cache" });
  const [
    updateProduct,
    { data: update_data, loading: update_loading, error: update_error, reset: update_reset },
  ] = useMutation(UPDATE_PRODUCT, { fetchPolicy: "no-cache" });
  const { data: list_data, loading: list_loading, error: list_error } = useQuery(GET_CATEGORIES);
  const {
    data: vochers_data,
    loading: vochers_loading,
    error: vochers_error,
  } = useQuery(GET_VOUCHERS, { variables: { applyAll: false, sellerId: currentUser?.ID } });
  const [
    addVoucherRef,
    { data: voucher_ref_data, loading: voucher_ref_loading, error: voucher_ref_error },
  ] = useMutation(ADD_VOUCHER_REF, { fetchPolicy: "no-cache" });
  const [uploadImages, { data: upload_data, loading: upload_loading, error: upload_error }] =
    useMutation(MULTIPLE_UPLOAD, { fetchPolicy: "no-cache" });
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [tempProductValues, setTempProductValues] = useState();

  console.log("get product", item_data, item_loading, item_error);
  console.log("add new product", add_data, add_loading, add_error);
  console.log("update product", update_data, update_loading, update_error);
  console.log("get list categories", list_loading, list_error, list_data);
  console.log("get list vouchers", vochers_data, vochers_loading, vochers_error);
  console.log("add voucher ref", voucher_ref_data, voucher_ref_loading, voucher_ref_error);
  console.log("upload images", upload_data, upload_loading, upload_error);

  useEffect(() => {
    if (!isAddNew && id) setSkip(false);
  }, [isAddNew, id]);

  useEffect(() => {
    if (add_data && add_data?.addNewProduct?.status === "OK") {
      addVoucherRef({
        variables: {
          products: [add_data?.addNewProduct?.PRODUCT_ID],
          vouchers: [...vouchersValue],
        },
      });
      notification.success({ message: "Add new product successfully", placement: "bottomLeft" });
      add_reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add_data]);

  useEffect(() => {
    if (update_data && update_data?.updateProduct?.status === "OK") {
      const variables = {
        products: [id],
        vouchers: [...vouchersValue],
      };
      console.log("add ref", variables);
      addVoucherRef({ variables });
      notification.success({ message: "Update product successfully", placement: "bottomLeft" });
      update_reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update_data]);

  useEffect(() => {
    if (item_data && item_data?.getProducts?.length === 1) {
      const product = item_data?.getProducts[0];
      form.setFields(
        Object.keys(product).map((name) => {
          let value = product[name];
          if (name === "CATEGORY") {
            value = product[name]?.ID;
            name = "CATEGORY_ID";
          }
          if (name === "VOUCHER") {
            value = product[name]?.map((item) => item.ID);
            name = "VOUCHERS";
          }
          return { name, value };
        })
      );
      setCurrentProduct(product);
      setShortDesc(product?.DESCRIPTION);
      setLongDesc(product?.DETAILS);
      try {
        let gallery = JSON.parse(product?.GALLERY);
        gallery = gallery?.map((item) => ({
          thumbUrl: keys.SERVER_URI + item,
          uid: nanoid(20),
          old_img: true,
        }));
        console.log("gallery", gallery);
        setFileList(gallery);
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item_data]);

  useEffect(() => {
    if (upload_data && upload_data?.multipleUpload?.status === "OK") {
      if (isAddNew) handleAddNew(tempProductValues, upload_data?.multipleUpload?.URL);
      else {
        const oldImages = fileList
          .filter((item) => item.old_img === true)
          .map((item) => item.thumbUrl.replace(keys.SERVER_URI, ""));
        handleEdit(tempProductValues, [...oldImages, ...upload_data?.multipleUpload?.URL]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload_data]);

  const onFinish = (values) => {
    values.SELLER_ID = currentUser.ID;
    values.DESCRIPTION = shortDesc;
    values.DETAILS = longDesc;

    delete values.VOUCHERS;

    if (newFileList.length > 0) {
      uploadImages({ variables: { file: newFileList } });
      setTempProductValues(values);
    } else {
      if (isAddNew) handleAddNew(values);
      else {
        const oldImages = fileList
          .filter((item) => item.old_img === true)
          .map((item) => item.thumbUrl.replace(keys.SERVER_URI, ""));
        handleEdit(values, oldImages);
      }
    }
  };

  const handleAddNew = (values, images = []) => {
    if (images.length > 0) values.GALLERY = JSON.stringify(images);
    else values.GALLERY = JSON.stringify([]);
    console.log("add product", values);
    addProduct({ variables: { products: [values] } });
  };

  const handleEdit = (values = {}, images = []) => {
    values.ID = currentProduct.ID;
    if (images.length > 0) values.GALLERY = JSON.stringify(images);
    console.log("edit product", values);
    updateProduct({ variables: { product: values } });
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

        <Collapse defaultActiveKey="1">
          <Collapse.Panel key="1" header="Basic Information">
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item label="Product name" name="PRODUCT_NAME" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Category" name="CATEGORY_ID" rules={[{ required: true }]}>
                  <Select loading={list_loading}>
                    {list_data?.getCategories?.map((category) => (
                      <Select.Option key={category.ID} value={category.ID}>
                        {category.CATEGORIES_NAME}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Price" name="PRICE" rules={[{ required: true }]}>
                  <InputNumber
                    min={0}
                    addonAfter="VND"
                    style={{ width: "100%" }}
                    parser={currencyParser}
                    formatter={formatNumberToPrice}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Vouchers" name="VOUCHERS" rules={[{ required: true }]}>
                  <Select loading={list_loading} mode="multiple" allowClear>
                    {vochers_data?.getVouchers?.map((category) => (
                      <Select.Option key={category.ID} value={category.ID}>
                        {category.VOUCHER_NAME}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Collapse.Panel>

          <Collapse.Panel key="2" header="Product Description">
            <div style={{ marginBottom: 10 }}>Short Description</div>
            <TextEditor value={shortDesc} setValue={setShortDesc} />

            <br />

            <div style={{ marginBottom: 10 }}>Detail Description</div>
            <TextEditor value={longDesc} setValue={setLongDesc} />
          </Collapse.Panel>

          <Collapse.Panel key="3" header="Media">
            <UploadGallery
              fileList={fileList}
              setFileList={setFileList}
              setNewFileList={setNewFileList}
            />
          </Collapse.Panel>
        </Collapse>
      </Form>
    </Spin>
  );
};
