import { useEffect, useState } from "react";
import { Form, Input, Button, message, Flex, Typography } from "antd";
import { login, getUserInfo } from "../services/user";
import { getToken, setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { get } from "http";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      if(!result.ok){
        messageApi.warning(result.msg || "登录失败");
        return;
      }
      messageApi.success("登录成功");
      setToken(result.token);
      navigate("/dashboard");
    } catch (error: any) {
      messageApi.error(error.response?.data?.msg || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  // 检查重新登录
  useEffect(() => {
    const valid = async () => {
      try {
        if(getToken() == null){
          return;
        }
        const result = await getUserInfo();
        if (result.ok) {
          navigate("/dashboard");
        } else{
          messageApi.info("请先登录");
        }
      } catch (error: any) {
        console.error("验证登录状态失败:", error);
        messageApi.error(error.response?.data?.msg || "验证登录状态失败");
      }
    };
    valid();
  }, [messageApi, navigate]);

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
