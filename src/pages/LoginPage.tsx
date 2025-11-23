// LoginPage.tsx
import { useState } from "react";
import { Form, Input, Button, message, Flex, Typography } from "antd";
import { login } from "../services/user";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const { token } = await login(values.username, values.password);
      messageApi.success("登录成功");
      setToken(token);
      navigate("/dashboard");
    } catch (error: any) {
      messageApi.error(error.response?.data?.msg || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <Form name="login_form" onFinish={onFinish} style={{ width: "300px" }}>
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            欢迎登录
          </Typography.Title>
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Flex>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
              <Button type="link" htmlType="button" onClick={() => navigate("/register")}>
                立即注册
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
