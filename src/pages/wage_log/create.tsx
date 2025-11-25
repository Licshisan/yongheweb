import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Cascader, DatePicker, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState, useEffect } from "react";
import { getWorkers, Worker } from "../../services/worker";
import { getProcesses, Process } from "../../services/process";
import { getSpecModels, SpecModel } from "../../services/specModel";
import {
  updateWageLog,
  createWageLog,
  deleteWageLog,
  WageLog,
  getWageLogs,
} from "../../services/wageLogs";
import dayjs from "dayjs";

const WageLogCreatePage: React.FC = () => {
  const actionRef = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [wageLogs, setWageLogs] = useState<WageLog[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [specModels, setSpecModels] = useState<SpecModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState<string[]>([]);
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [price, setPrice] = useState<number>(0);
  // 加载日期日薪记录
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await getWageLogs(date);
        if (result.data) {
          setWageLogs(result.data);
        }
      } catch (error: any) {
        console.error("加载日薪记录失败:", error);
        messageApi.error("加载日薪记录失败");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [messageApi, date]);

  // 加载所有工人
  useEffect(() => {
    const load = async () => {
      const result = await getWorkers();
      if (result.data) {
        setWorkers(result.data);
      }
    };
    load();
  }, []);

  // 加载所有工序
  useEffect(() => {
    const load = async () => {
      const result = await getProcesses();
      if (result.data) {
        setProcesses(result.data);
      }
    };
    load();
  }, []);


  // 加载所有规格
  useEffect(() => {
    const load = async () => {
      const result = await getSpecModels();
      if (result.data) {
        setSpecModels(result.data);
      }
    };
    load();
  }, []);


  const generateCascaderOptions = () => {
    const specMap = new Map();
    specModels.forEach(s => {
      if (!specMap.has(s.process_id)) {
        specMap.set(s.process_id, []);
      }
      specMap.get(s.process_id).push(s);
    });

    // 构建树形结构
    return workers.map(worker => {
      // 为每个工人，筛选出他能做的工序
      const workerProcesses = processes.filter(process => {
        // 检查工序的 worker_id 数组是否包含当前工人的 id
        const index = process?.workers?.findIndex(w=>w.id === worker.id)
        return index !== -1
      });

      return {
        value: worker.id.toString(),
        label: worker.name,
        // 将筛选出的工序转换为 children 格式
        children: workerProcesses.map(process => ({
          value: process.id.toString(),
          label: process.name,
          children: specMap.get(process.id)?.map((spec: SpecModel) => ({
            value: spec.id.toString(),
            label: spec.name,
          })),
        })),
      };
    });
  };

  const onChange = (selectedValue: string[]) => {
    if(selectedValue){
      setValue(selectedValue)
      const id = Number(selectedValue[2])
      const sepcModel = specModels.find(s => s.id === id)
      if(sepcModel?.price){
        setPrice(sepcModel.price)
      }
      return
    }
    setValue([]);
  };

  const options = generateCascaderOptions();

  const columns: ProColumns<WageLog>[] = [
    {
      title: "工人",
      key: "worker_id",
      dataIndex: "worker_id",
      valueType: "select",
      formItemProps: { rules: [{ required: true, message: "请选择工人" }]},
      request: async () => {
        return workers.map((w)=> {
          return { label: w.name, value: w.id}
        })
      },
    },
    {
      title: "工序",
      key: "process_id",
      dataIndex: "process_id",
      valueType: "select",
      formItemProps: { rules: [{ required: true, message: "请选择工序" }] },
      request: async () => {
      return processes.map((w)=> {
        return { label: w.name, value: w.id}
      })
      },
    },
    {
      title: "规格型号",
      key: "spec_model_id",
      dataIndex: "spec_model_id",
      valueType: "select",
      
      formItemProps: { rules: [{ required: true, message: "请选择规格型号" }] },
      request: async () => {
      return specModels.map((w)=> {
        return { label: w.name, value: w.id}
      })
      },
    },
    {
      title: "工价",
      key: "actual_price",
      dataIndex: "actual_price",
      valueType: "digit",
      fieldProps: { prefix: "￥"},
      formItemProps: { rules: [{ required: true, message: "请输入工价" }] },
    },
    {
      title: "数量",
      key: "quantity",
      dataIndex: "quantity",
      valueType: "digit",
      formItemProps: { rules: [{ required: true, message: "请输入数量" }] },
    },
    {
      title: "组人数",
      key: "actual_group_size",
      dataIndex: "actual_group_size",
      valueType: "digit",
      formItemProps: { rules: [{ required: true, message: "请输入组人数" }] },
    },
    {
      title: "工资",
      key: "total_wage",
      dataIndex: "total_wage",
      fieldProps: { prefix: "￥"},
      valueType: "digit",
    },
    {
      title: "日期",
      key: "date",
      dataIndex: "date",
      valueType: "date",
      initialValue: date,
    },
    {
      title: "备注",
      key: "remark",
      dataIndex: "remark",
      valueType: "text",
      fieldProps: {
        maxLength: 200,
        showCount: true,
      },
    },
    {
      title: "操作",
      key: "action",
      valueType: "option",
      width: 200,
      render: (_, record, __, action) => (
        <div>
          <Button type="link" onClick={() => action?.startEditable?.(record.id, record)}>编辑</Button>
          <Popconfirm title="确认删除吗？" onConfirm={() => onDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onCreate = () => {
    const record = {
        id: Date.now(), // 使用时间戳
        worker_id: value[0] ? Number(value[0]): undefined,
        process_id: value[1] ? Number(value[1]): undefined,
        spec_model_id: value[2] ? Number(value[2]): undefined,
        date,
        actual_price: price,
        quantity: 1,
        actual_group_size: 1,
        total_wage: price,
        remark: "",
      } as WageLog
    actionRef.current?.addEditRecord?.(record);
  }

  const onDelete = async (id: number) => {
    try{
      const res = await deleteWageLog(id)
      if(res.ok){
        message.success('删除成功');
      }
      fresh();
    } catch (error: any) {
      console.error("删除失败:", error);
      messageApi.error("删除失败");
    }
  }

  const handleSave = async (key: any, record: WageLog, originRow: WageLog) => {
    const index = wageLogs.findIndex(w => w.id === key)
    setLoading(true);
    try {
      if (index === -1) {
        // 新增记录
        await createWageLog(record);
        message.success('添加成功');
      } else {
        // 编辑现有记录
        const playload = {
          ...record,
          date: record.date ?  dayjs(record.date).format('YYYY-MM-DD')  : '',
        }
        console.log(playload)
        await updateWageLog(originRow.id, playload);
        message.success('更新成功');
      }
      
      // 退出编辑模式
      setEditableRowKeys(prev => prev.filter(k => k !== key));
      fresh();
    } catch (error: any) {
      console.error('保存数据时发生错误:', error);
      messageApi.warning(error.response?.data?.msg || "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const fresh = async () => {
    try {
      setLoading(true);
      const result = await getWageLogs(date);
      if (result.data) {
        setWageLogs(result.data);
      }
    } catch (error: any) {
      console.error("刷新失败:", error);
      messageApi.error("刷新失败");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {contextHolder}
      <Typography.Title level={2}>日薪录入</Typography.Title>
      <Space style={{marginBottom: 16}}>
        <Cascader
          options={options}
          value={value}
          onChange={onChange}
          placeholder="请选择 工人 > 工序 > 规格"
          style={{ minWidth: 400 }}
        />
        <DatePicker value={dayjs(date)} onChange={(_, dateString) => setDate(dateString as string)} />
        <Button type="primary" onClick={onCreate} disabled={value.length === 0}>新建一行</Button>
      </Space>

      <EditableProTable<WageLog>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        value={wageLogs}
        loading={loading}
        scroll={{ x: 1200 }}
        editable={{
          type: "multiple",
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: handleSave
        }}
        recordCreatorProps={false}
      />
    </>
  );
};

export default WageLogCreatePage;
