import { useEffect, useState } from 'react';
import { Typography, Space, message, Input, Checkbox, Table, Button } from 'antd';

import { Worker, getWorkers, updateWorker, deleteWorker } from '../../services/workers';

const { Title } = Typography;
const { Search } = Input;

// 定义 WorkerList 的 Props 接口
interface WorkerListProps {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (id: number) => void;
}

// WorkerList 组件
const WorkerList: React.FC<WorkerListProps> = ({ workers, onEdit, onDelete }) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '身份证',
      dataIndex: 'id_card',
      key: 'id_card',
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: '所属工序',
      dataIndex: ['process', 'name'],
      key: 'process_name',
      render: (text: string) => text || '-',
    },
    {
      title: '入职时间',
      dataIndex: 'entry_date',
      key: 'entry_date',
    },
    {
      title: '离职时间',
      dataIndex: 'leave_date',
      key: 'leave_date',
      render: (text: string | null) => (text ? text : '-'),
    },
    {
      title: '是否在职',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Worker) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          {/* 
          <Button type="link" danger onClick={() => onDelete(record.id)}>删除</Button>
          */}
        </Space>
      ),
    },
  ];

  return <Table dataSource={workers} columns={columns} rowKey="id" pagination={false} />;
};

// --- WorkerPage 主组件 ---
const WorkerPage = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['在职']);

  const loadWorkers = async () => {
    try {
      const res = await getWorkers();
      setWorkers(res.data.workers);
    } catch (err) {
      message.error('加载工人信息失败');
    }
  };

  useEffect(() => {
    applyFilters(searchKeyword, statusFilter);
  }, [workers, searchKeyword, statusFilter]);

  useEffect(() => {
    loadWorkers();
  }, []);

  const applyFilters = (keyword: string, statuses: string[]) => {
    const filtered = workers.filter((worker) => {
      const matchName = worker.name.toLowerCase().includes((keyword || '').toLowerCase());
      const matchStatus = statuses.length === 0 || statuses.includes(worker.status || '');
      return matchName && matchStatus;
    });
    setFilteredWorkers(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusChange = (checked: string[]) => {
    setStatusFilter(checked);
    applyFilters(searchKeyword, checked);
  };

  const handleSave = async (data: Partial<Worker>) => {
    if (!editing) return;
    try {
      await updateWorker(editing.id, data);
      message.success('更新成功');
      setEditing(null);
      setModalVisible(false);
      loadWorkers();
    } catch (err) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWorker(id);
      message.success('删除成功');
      loadWorkers();
    } catch (err) {
      message.error('删除失败');
    }
  };

  return (
    <>
      <Title level={3}>工人信息管理</Title>
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="请输入姓名搜索"
          onSearch={handleSearch}
          allowClear
          style={{ width: 300, marginRight: 50 }}
        />
        <Checkbox.Group
          style={{ marginRight: 16 }}
          options={[
            { label: '在职', value: '在职' },
            { label: '离职', value: '离职' },
          ]}
          value={statusFilter}
          onChange={handleStatusChange}
        />
      </Space>

      {/* 直接使用 WorkerList 组件 */}
      <WorkerList
        workers={filteredWorkers}
        onEdit={(w) => {
          setEditing(w);
          setModalVisible(true);
        }}
        onDelete={handleDelete}
      />
    </>
  );
};

export default WorkerPage;
