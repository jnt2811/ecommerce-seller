import { keys } from "../constants";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Button, Form, Input, notification, Row, Spin, Typography } from "antd";
import { GET_SELLER, UPDATE_SELLER } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../contexts/AuthContext";

export const Settings = () => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const {
    loading: item_loading,
    error: item_error,
    data: item_data,
  } = useQuery(GET_SELLER, { variables: { id: currentUser?.ID }, fetchPolicy: "no-cache" });
  const [
    updateSeller,
    { data: update_data, loading: update_loading, error: update_error, reset: update_reset },
  ] = useMutation(UPDATE_SELLER);
  const [currentMarker, setCurrentMarker] = useState({ lat: 0, lng: 0 });

  console.log("get seller", item_data, item_loading, item_error);
  console.log("update seller", update_data, update_loading, update_error);

  useEffect(() => {
    if (item_data && item_data?.getSeller?.length === 1) {
      const seller = item_data?.getSeller[0];
      console.log(seller);
      form.setFields(
        Object.keys(seller).map((name) => {
          let value = seller[name];
          return { name, value };
        })
      );

      if (!!seller.LOCATION) {
        const parsedLocation = JSON.parse(seller.LOCATION);
        console.log("aaa parse", parsedLocation);
        setCurrentMarker(parsedLocation);
        try {
        } catch (error) {
          console.log(error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item_data]);

  useEffect(() => {
    if (update_data) {
      if (update_data?.updateSeller?.status === "KO") {
        notification.error({
          placement: "bottomLeft",
          message: update_data?.updateSeller?.message,
        });
        update_reset();
      } else if (update_data?.updateSeller?.status === "OK") {
        notification.success({
          placement: "bottomLeft",
          message: "Update seller successfully!",
        });
        update_reset();
      }
    }
  }, [form, update_data, update_reset]);

  const handleGetCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setCurrentMarker(pos);
    });
  };

  const onFinish = (values) => {
    values.LOCATION = JSON.stringify(currentMarker);
    values.ID = currentUser?.ID;
    console.log(values);
    updateSeller({ variables: { seller: values } });
  };

  console.log("aaa", currentMarker);

  return (
    <Spin spinning={item_loading}>
      <Typography.Title level={3}>Settings</Typography.Title>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Name" name="SELLER_NAME">
          <Input />
        </Form.Item>
      </Form>

      <label htmlFor="">Location</label>
      <LoadScript googleMapsApiKey={keys.GOOGLE_MAP} libraries={["places"]}>
        <GoogleMap mapContainerStyle={containerStyle} center={currentMarker} zoom={19}>
          {/* <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Customized your placeholder"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
            }}
          />
        </StandaloneSearchBox> */}

          <Row justify="center">
            <Button onClick={handleGetCurrentLocation}>Get your location</Button>
          </Row>

          <Marker position={currentMarker} />
        </GoogleMap>
      </LoadScript>

      <br />

      <Button type="primary" onClick={() => form.submit()} loading={update_loading}>
        Save
      </Button>
    </Spin>
  );
};

const containerStyle = {
  width: "100%",
  height: "300px",
};
