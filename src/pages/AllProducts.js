import { useMutation, useQuery } from "@apollo/client";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { paths } from "../constants";
import { formatNumberToPrice } from "../helpers";
import moment from "moment";
import { GET_PRODUCTS, UPDATE_PRODUCT } from "../queries";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const AllProducts = () => {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState();
  const {
    loading: list_loading,
    error: list_error,
    data: list_data,
  } = useQuery(GET_PRODUCTS, {
    variables: { searchString: searchValue },
    fetchPolicy: "no-cache",
  });

  console.log("list products", list_data, list_loading, list_error);

  const columns = [
    {
      title: "Product name",
      dataIndex: "PRODUCT_NAME",
    },
    {
      title: "Price",
      dataIndex: "PRICE",
      render: formatNumberToPrice,
    },
    {
      title: "Status",
      dataIndex: "PRODUCT_LOCK",
      render: (isLock) =>
        !isLock ? <Tag color="green">Public</Tag> : <Tag color="red">Private</Tag>,
    },
    {
      title: "Created at",
      dataIndex: "CREATE_AT",
      render: (data) => moment(data).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Updated at",
      dataIndex: "UPDATE_AT",
      render: (data) => moment(data).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => history.push(paths.ALL_PRODUCTS + `/${record.ID}`)}
          ></Button>

          <DeleteButton record={record} searchValue={searchValue} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Topbar
        title="All products"
        onSearch={setSearchValue}
        showAddNew
        onAddNew={() => history.push(paths.NEW_PRODUCT)}
      />

      <Table
        columns={columns}
        dataSource={list_data?.getProducts}
        loading={list_loading}
        pagination={{ pageSize: 5 }}
        rowKey="ID"
      />
    </div>
  );
};

const DeleteButton = ({ record, searchValue }) => {
  const [updateProduct, { data: update_data, loading: update_loading, error: update_error }] =
    useMutation(UPDATE_PRODUCT, {
      refetchQueries: [{ query: GET_PRODUCTS, variables: { searchString: searchValue } }],
    });

  console.log(`delete product ID ${record?.ID}:`, update_data, update_loading, update_error);

  return (
    <Popconfirm
      title="Are you sure?"
      onConfirm={() =>
        updateProduct({
          variables: { product: { ID: record.ID, STATE: false } },
        })
      }
    >
      <Button icon={<DeleteOutlined />} type="primary" danger loading={update_loading}></Button>
    </Popconfirm>
  );
};
