import React from "react";
import { Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const onExit = () => {
    removeToken();
    navigate("/login");
  }

  return (
    <>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography.Title level={2} style={{ marginTop: -100 }}>
          欢迎使用工人工资管理系统
        </Typography.Title>
        <Typography.Text type="secondary">登录成功，请通过左侧菜单选择功能</Typography.Text>
        <Button onClick={onExit}>退出登录</Button>
      </Card>
    </>
  );
};

export default DashboardPage;
