// src/pages/workers/WorkerFormPage.tsx
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, message, DatePicker, Radio, Card, Typography, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getProcesses } from "../../services/processes";
import { createWorker, updateWorker } from "../../services/workers";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const WorkerFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const [processes, setProcesses] = useState<{ id: number; name: string }[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // ... (省略加载数据的 useEffect 和 handleSubmit, handleCancel 函数)
  // 加载工序列表
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const res = await getProcesses();
        setProcesses(res.processes || []);
      } catch (error) {
        console.error("加载工序失败:", error);
        message.error("加载工序失败");
      }
    };
    loadProcesses();
  }, []);

  // 如果是编辑模式，加载工人数据
  useEffect(() => {
    if (isEditMode) {
      const loadWorkerData = async () => {
        try {
          setLoading(true);
        } catch (error) {
          console.error("加载工人数据失败:", error);
          message.error("加载工人数据失败，可能该工人已被删除。");
          navigate("/workers"); // 加载失败则跳回列表页
        } finally {
          setLoading(false);
        }
      };
      loadWorkerData();
    } else {
      setLoading(false);
      // 新增模式下设置默认状态
      form.setFieldsValue({ status: "在职" });
    }
  }, [id, isEditMode, form, navigate]);

  // 当 initialData 变化时，设置表单值
  useEffect(() => {
    if (initialData && !loading) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, loading, form]);

  const status = Form.useWatch("status", form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        entry_date: values.entry_date ? values.entry_date.format("YYYY-MM-DD") : null,
        leave_date: values.leave_date ? values.leave_date.format("YYYY-MM-DD") : null,
      };

      if (isEditMode) {
        await updateWorker(Number(id), payload);
        message.success("工人信息更新成功！");
      } else {
        await createWorker(payload);
        message.success("工人创建成功！");
      }
      navigate("/workers"); // 保存成功后跳回工人列表页
    } catch (err: any) {
      if (err.errorFields) {
        message.error("请检查并填写必填项");
      } else {
        message.error("操作失败，请稍后再试。");
      }
    }
  };

  const handleCancel = () => {
    navigate("/workers");
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: "24px" }}>
        {isEditMode ? "编辑工人" : "新增工人"}
      </Title>

      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: "请输入姓名" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="id_card" label="身份证号" rules={[{ required: true, message: "请输入身份证号" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="group" label="小组">
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="process_id" label="所属工序" rules={[{ required: true, message: "请选择工序" }]}>
              <Select placeholder="请选择工序" showSearch optionFilterProp="children">
                {processes.map((proc) => (
                  <Option key={proc.id} value={proc.id}>
                    {proc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="entry_date"
              label="入职日期"
              rules={[{ required: true, message: "请选择入职日期" }]}
              initialValue={dayjs()}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="在职">在职</Radio>
                <Radio value="离职">离职</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            {status === "离职" && (
              <Form.Item name="leave_date" label="离职日期" rules={[{ required: true, message: "请选择离职日期" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} justify="end">
          <Col>
            <Button onClick={handleCancel}>取消</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default WorkerFormPage;
