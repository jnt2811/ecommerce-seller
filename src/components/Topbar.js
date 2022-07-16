import { Button, PageHeader } from "antd";

export const Topbar = ({ title = "Title", showAddNew = true, onAddNew = () => {} }) => {
  return (
    <PageHeader
      title={title}
      subTitle={
        showAddNew && (
          <Button type="primary" onClick={() => onAddNew()}>
            Add New
          </Button>
        )
      }
      style={styles}
    />
  );
};

const styles = {
  padding: 0,
  marginBottom: 15,
};
