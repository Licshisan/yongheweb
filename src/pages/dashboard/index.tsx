import React from "react";
import { Typography, Card, Button, Flex, Space, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const onExit = () => {
    removeToken();
    navigate("/login");
  }

  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography.Title level={2} style={{ marginBottom: 16 }}>
        欢迎使用工人工资管理系统
      </Typography.Title>
      <Space>
        <Typography.Text type="secondary" style={{ marginBottom: 24 }}>
          登录成功，请通过左侧菜单选择功能
        </Typography.Text>
        <Popconfirm title="确定退出登录吗？" onConfirm={onExit} okText="确定" cancelText="取消">
          <Button type="link">
            退出登录
          </Button>
        </Popconfirm>
      </Space>
    </Card>
  );
};

export default DashboardPage;
