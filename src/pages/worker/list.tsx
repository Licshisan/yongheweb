import { useEffect, useState } from "react";
import { Typography, Space, message, Input, Table, Button, Popconfirm, TableColumnsType } from "antd";

import { Worker, getWorkers, deleteWorker } from "../../services/worker";
import { useNavigate } from "react-router-dom";

const WorkerListPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadWorkers = async (search: string = "") => {
    try {
      setLoading(true);
      const result = await getWorkers();
      if (result.data) {
        const filteredWorkers = result.data.filter((worker: Worker) =>
          worker.name.toLowerCase().includes(search.toLowerCase()),
        );
        setWorkers(filteredWorkers);
      }
    } catch (error: any) {
      console.error("加载工人失败:", error);
      messageApi.warning(error.response?.data?.msg || "加载工人失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索框输入变化
  const handleSearch = (value: string) => {
    loadWorkers(value);
  };

  // 编辑
  const handleEdit = (worker: Worker) => {
    navigate(`/worker/create?id=${worker.id}`);
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await deleteWorker(id);
      loadWorkers();
    } catch (error: any) {
      console.error("删除工人失败:", error);
      messageApi.warning(error.response?.data?.msg || "删除工人失败");
    }
  };
  
  useEffect(() => {
    loadWorkers();
  }, []);

  const columns: TableColumnsType<Worker> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "身份证",
      dataIndex: "id_card",
      key: "id_card",
    },
    {
      title: "分组",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "所属工序",
      dataIndex: ["process", "name"],
      key: "process_name",
      render: (text: string) => text || "-",
    },
    {
      title: "是否在职",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "在职", value: "在职" },
        { text: "离职", value: "离职" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "入职时间",
      dataIndex: "entry_date",
      key: "entry_date",
    },
    {
      title: "离职时间",
      dataIndex: "leave_date",
      key: "leave_date",
      render: (text: string | null) => (text ? text : "-"),
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      render: (_: any, record: Worker) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <>
      {contextHolder}
      <Typography.Title level={3}>工人信息管理</Typography.Title>
      <Input.Search placeholder="请输入姓名搜索" onSearch={handleSearch} style={{ width: 300, marginBottom: 20 }} />
      <Table loading={loading}  dataSource={workers} columns={columns} rowKey="id" pagination={false} />
    </>
  );
};

export default WorkerListPage;
