import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Typography, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createSpecModel, getSpecModel, SpecModel, updateSpecModel } from "../../services/specModel";
import { getProcesses } from "../../services/process";

const { Option } = Select;
const { Title } = Typography;

const SpecModelCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [processes, setProcesses] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const id = searchParams.get("id");
  const isEditMode = !!id;

  useEffect(() => {
    // 加载工序列表
    const loadProcesses = async () => {
      try {
        const result = await getProcesses();
        if (result.data) {
          setProcesses(result.data);
        }
      } catch (error) {
        console.error("加载工序失败:", error);
        messageApi.error("加载工序失败");
      }
    };

    loadProcesses();

    // 如果是编辑模式，加载当前规格型号数据
    if (isEditMode && id) {
      const loadSpecModel = async () => {
        try {
          setLoading(true);
          const response = await getSpecModel(Number(id));
          form.setFieldsValue(response.data);
        } catch (error) {
          console.error("加载规格型号失败:", error);
          messageApi.error("加载规格型号失败");
        } finally {
          setLoading(false);
        }
      };

      loadSpecModel();
    }
  }, [id, isEditMode, form, messageApi]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const specModelData: SpecModel = {
        id: isEditMode ? Number(id) : 0,
        name: values.name,
        category: values.category,
        price: values.price,
        process_id: Number(values.process_id),
      };

      setLoading(true);
      if (isEditMode) {
        await updateSpecModel(Number(id), specModelData);
        messageApi.success("规格型号更新成功");
      } else {
        await createSpecModel(specModelData);
        messageApi.success("规格型号创建成功");
      }

      // 成功后跳回列表页
      setTimeout(() => {
        navigate("/spec-model/list");
      }, 1000);
    } catch (error) {
      console.error("保存规格型号失败:", error);
      messageApi.error("保存规格型号失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/spec-model/list");
  };

  return (
    <div className="p-6">
      {contextHolder}
      <Title level={2}>{isEditMode ? "编辑规格型号" : "新增规格型号"}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="process_id" label="选择工序" rules={[{ required: true, message: "请选择工序！" }]}>
          <Select placeholder="请选择工序">
            {processes.map((process) => (
              <Option key={process.id} value={process.id}>
                {process.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="name" label="规格名称" rules={[{ required: true, message: "请输入规格名称！" }]}>
          <Input placeholder="请输入规格名称" />
        </Form.Item>

        <Form.Item name="category" label="分类" rules={[{ required: true, message: "请输入分类！" }]}>
          <Input placeholder="请输入分类" />
        </Form.Item>

        <Form.Item name="price" label="工价" rules={[{ required: true, message: "请输入工价！" }]}>
          <Input type="number" placeholder="请输入工价" />
        </Form.Item>

        <Row gutter={24} justify="end">
          <Col>
            <Button onClick={handleCancel}>取消</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SpecModelCreatePage;
