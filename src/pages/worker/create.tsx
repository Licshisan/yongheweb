import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, DatePicker, Radio, Typography, Row, Col } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createWorker, updateWorker, getWorker } from "../../services/worker";
import { getProcesses } from "../../services/process";
import dayjs from "dayjs";

const { Option } = Select;

const WorkerCreatePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [processes, setProcesses] = useState<{ id: number; name: string }[]>([]);
  const status = Form.useWatch("status", form);

  const id = searchParams.get("id");
  const isEditMode = !!id;

  // 加载工序数据（如果是编辑模式）
  useEffect(() => {
    if (isEditMode) {
      const loadWorkerData = async () => {
        try {
          setLoading(true);
          const response = await getWorker(Number(id));
          if (response.data) {
            const playload = {
              ...response.data,
              entry_date: response.data.entry_date ? dayjs(response.data.entry_date) : null,
              leave_date: response.data.leave_date ? dayjs(response.data.leave_date) : null,
            };
            form.setFieldsValue(playload);
          } else {
            messageApi.warning("未找到对应的工人数据");
          }
        } catch (error: any) {
          console.error("加载工人数失败:", error);
          messageApi.error(error.response?.data?.msg || "加载工人数失败");
        } finally {
          setLoading(false);
        }
      };
      loadWorkerData();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, messageApi, form]);

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        entry_date: values.entry_date ? values.entry_date.format("YYYY-MM-DD") : null,
        leave_date: values.leave_date ? values.leave_date.format("YYYY-MM-DD") : null,
      };
      console.log("提交的工人数据:", payload);
      if (isEditMode && id) {
        await updateWorker(Number(id), payload);
        messageApi.success("工人更新成功");
      } else {
        await createWorker(payload);
        messageApi.success("新建工人成功");
      }
      setTimeout(() => {
        navigate("/worker/list");
      }, 500);
    } catch (error: any) {
      console.error("保存工人失败:", error);
      messageApi.error(error.response?.data?.msg || "保存工人失败");
    }
  };

  // 取消按钮处理
  const handleCancel = () => {
    navigate("/worker/list");
  };

  // 加载所有工序以供选择
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const processes = await getProcesses();
        if (processes.data) {
          setProcesses(processes.data);
        } else {
          messageApi.warning("未找到工序数据");
        }
      } catch (error) {
        console.error("加载工序失败:", error);
        messageApi.error("加载工序失败");
      }
    };
    loadProcesses();
  }, []);

  return (
    <>
      {contextHolder}
      <Typography.Title level={3}> {isEditMode ? "编辑工人" : "新增工人"}</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
            <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={"在职"}>
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
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default WorkerCreatePage;
