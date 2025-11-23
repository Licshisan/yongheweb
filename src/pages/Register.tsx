// src/RegisterPage.tsx
import { useState } from "react";
import { Form, Input, Button, message, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { register } from "../services/user";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      return;
    }
    try {
      setLoading(true);
      await register(values.username, values.password);
      form.resetFields();
      messageApi.success("注册成功！请返回登录");
    } catch (error: any) {
      messageApi.error(error.response?.data?.msg || "注册失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form form={form} name="register_form" onFinish={onFinish} style={{ width: "300px" }}>
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            用户注册
          </Typography.Title>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { max: 20, message: "用户名长度不能超过 20 位" },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度至少为 6 位" },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]} // 依赖 password 字段
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致！"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Flex>
              <Button type="primary" htmlType="submit" loading={loading} block>
                注册
              </Button>
              <Button type="link" htmlType="button" onClick={() => navigate("/login")}>
                前往登录
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
