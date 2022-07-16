import { useQuery } from "@apollo/client";
import { Button, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Topbar } from "../components/Topbar";
import { paths } from "../constants";
import moment from "moment";
import { GET_PRODUCTS } from "../queries";
import { EditOutlined } from "@ant-design/icons";

export const AllProducts = () => {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState();
  const {
    loading: list_loading,
    error: list_error,
    data: list_data,
  } = useQuery(GET_PRODUCTS, {
    variables: { searchString: searchValue },
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
      render: (data) => moment(data).format("DD/MM/YYYY"),
    },
    {
      title: "Updated at",
      dataIndex: "UPDATE_AT",
      render: (data) => moment(data).format("DD/MM/YYYY"),
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
