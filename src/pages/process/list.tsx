import React, { useState, useEffect } from "react";
import { getProcesses, deleteProcess, Process } from "../../services/process";
import { Button, Table, Input, message, Popconfirm, Typography, TableColumnsType } from "antd";
import { useNavigate } from "react-router-dom";

const ProcessListPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProcesses = async (search: string = "") => {
    try {
      setLoading(true);
      const result = await getProcesses();
      if (result.data) {
        const filteredProcesses = result.data.filter((process: Process) =>
          process.name.toLowerCase().includes(search.toLowerCase()),
        );
        setProcesses(filteredProcesses);
      }
    } catch (error: any) {
      console.error("加载工序失败:", error);
      messageApi.warning(error.response?.data?.msg || "加载工序失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索框输入变化
  const handleSearch = (value: string) => {
    loadProcesses(value);
  };

  // 编辑工序
  const handleEdit = (process: Process) => {
    navigate(`/process/create?id=${process.id}`);
  };

  // 删除工序
  const handleDelete = async (id: number) => {
    try {
      await deleteProcess(id);
      loadProcesses();
    } catch (error: any) {
      console.error("删除工序失败:", error);
      messageApi.warning(error.response?.data?.msg || "删除工序失败");
    }
  };

  useEffect(() => {
    loadProcesses();
  }, []);

  const columns: TableColumnsType<Process> = [
    {
      title: "工序名称",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      render: (_: any, record: Process) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Typography.Title level={3}>工序信息管理</Typography.Title>
      <Input.Search placeholder="搜索工序名称" onSearch={handleSearch} style={{ width: 300, marginBottom: 20 }} />
      <Table loading={loading} dataSource={processes} columns={columns} rowKey="id" pagination={false} />
    </>
  );
};

export default ProcessListPage;
