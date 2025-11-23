import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { createProcess, Process, updateProcess, getProcess } from "../../services/processes";

const ProcessFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState<Process>({
    id: 0,
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = !!id;

  // 加载工序数据（仅在编辑模式下）
  useEffect(() => {
    if (isEditMode) {
      const loadProcessData = async () => {
        try {
          setLoading(true);
          const process = await getProcess(Number(id));
          setInitialData(process);
        } catch (error) {
          navigate("/processes");
        } finally {
          setLoading(false);
        }
      };
      loadProcessData();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate]);

  // 当initialData变化时，设置表单值
  useEffect(() => {
    if (!loading) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, loading, form]);

  const handleFinish = async (values: Process) => {
    try {
      if (isEditMode && id) {
        // 编辑模式：调用更新接口
        await updateProcess(Number(id), values);
        message.success("工序更新成功！");
      } else {
        // 新增模式：调用创建接口
        await createProcess(values);
        message.success("工序创建成功！");
      }
      // 操作成功后跳转到工序列表页
      navigate("/processes");
    } catch (error) {
      console.error("保存工序失败:", error);
      message.error("保存工序失败，请稍后再试。");
    }
  };

  return (
    <>
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
            <Button onClick={() => navigate("/processes")}>取消</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ProcessFormPage;
