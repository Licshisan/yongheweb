import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Row, Col } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createProcess, Process, updateProcess, getProcess } from "../../services/process";

const ProcessCreatePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const id = searchParams.get("id");
  const isEditMode = !!id;

  // 加载工序数据（如果是编辑模式）
  useEffect(() => {
    if (isEditMode) {
      const loadProcessData = async () => {
        try {
          setLoading(true);
          const response = await getProcess(Number(id));
          if (response.data) {
            form.setFieldsValue(response.data);
          } else {
            messageApi.warning("未找到对应的工序数据");
          }
        } catch (error: any) {
          console.error("加载工序失败:", error);
          messageApi.error(error.response?.data?.msg || "加载工序失败");
        } finally {
          setLoading(false);
        }
      };
      loadProcessData();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, messageApi, form]);


  // 提交表单处理
  const handleFinish = async (values: Process) => {
    try {
      if (isEditMode && id) {
        await updateProcess(Number(id), values);
        messageApi.success("工序更新成功！");
      } else {
        await createProcess(values);
        messageApi.success("工序创建成功！");
      }
      setTimeout(() => {
        navigate("/process/list");
      }, 500);
    } catch (error: any) {
      console.error("保存工序失败:", error);
      messageApi.error(error.response?.data?.msg || "保存工序失败，请稍后再试。");
    }
  };

  // 取消按钮处理
  const handleCancel = () => {
    navigate("/process/list");
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={3}>{isEditMode ? "编辑工序" : "新增工序"}</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="工序名称" name="name" rules={[{ required: true, message: "请输入工序名称" }]}>
          <Input placeholder="请输入工序名称" />
        </Form.Item>

        <Form.Item label="描述" name="description" rules={[{ required: true, message: "请输入工序描述" }]}>
          <Input.TextArea rows={4} placeholder="请输入工序描述" />
        </Form.Item>

        <Row gutter={24} justify="end">
          <Col>
            <Button onClick={handleCancel}>取消</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ProcessCreatePage;
