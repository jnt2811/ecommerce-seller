import { Button, Input, PageHeader, Space } from "antd";

export const Topbar = ({
  title = "Title",
  showAddNew = false,
  onAddNew = () => {},
  showSearch = true,
  onSearch = () => {},
  loadingSearch = false,
  extraContent = <></>,
  onBack,
  style,
}) => {
  return (
    <div style={style}>
      <PageHeader
        style={styles}
        onBack={onBack}
        title={title}
        subTitle={
          showAddNew && (
            <Button type="primary" onClick={() => onAddNew()}>
              Add New
            </Button>
          )
        }
        extra={
          <Space>
            {extraContent}
            {showSearch && (
              <Input.Search placeholder="Search..." onSearch={onSearch} loading={loadingSearch} />
            )}
          </Space>
        }
      />
    </div>
  );
};

const styles = {
  padding: 0,
  marginBottom: 15,
};
