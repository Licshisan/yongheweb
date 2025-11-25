import { EditableProTable, ProColumns, ProFormDatePicker, ProFormSelect } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm, Space, Typography } from "antd";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { getWorkers, getWorkersBySearchDate, Worker } from "../../services/worker";
import { getProcesses, Process } from "../../services/process";
import { getSpecModels, SpecModel } from "../../services/specModel";
import {
  updateWageLog,
  createWageLog,
  deleteWageLog,
  getWageLogById,
  getWageLogsByDate,
  WageLog,
  getWageLogs,
} from "../../services/wageLogs";
import dayjs from "dayjs";

const WageLogCreatePage: React.FC = () => {
  const editabelRef = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [wageLogs, setWageLogs] = useState<WageLog[]>([]);
  const [loading, setLoading] = useState(false);

  // 搜索条件状态
  const [filterWorker, setFilterWorker] = useState<number>();
  const [filterProcess, setFilterProcess] = useState<number>();
  const [filterDate, setFilterDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const result = await getWageLogs();
        if (result.data) {
          setWageLogs(result.data);
        }
      } catch (error: any) {
        console.error("加载日薪记录失败:", error);
        messageApi.error("加载日薪记录失败");
      } finally{
        setLoading(false)
      }
    };
    fetch();
  }, [messageApi]);


  const columns: ProColumns<WageLog>[] = [
      {
        title: "工人",
        dataIndex: "worker_id",
        valueType: "select",
        formItemProps: { rules: [{ required: true, message: "请选择工人" }] },
        request: async () => {
          const result = await getWorkers();
          if (result.data) {
            return result.data.map((item) => ({ label: item.name, value: item.id })) || [];
          }
          return [];
        },
      },
      {
        title: "工序",
        dataIndex: "process_id",
        valueType: "select",
        formItemProps: { rules: [{ required: true, message: "请选择工序" }] },
        request: async () => {
          const result = await getProcesses();
          if (result.data) {
            return result.data.map((item) => ({ label: item.name, value: item.id })) || [];
          }
          return [];
        },
      },
      {
        title: "规格型号",
        dataIndex: "spec_model_id",
        valueType: "select",
        formItemProps: { rules: [{ required: true, message: "请选择规格型号" }] },
        dependencies: ["process_id"],
      },
      {
        title: "工价",
        dataIndex: "actual_price",
        valueType: "digit",
        formItemProps: { rules: [{ required: true, message: "请输入工价" }] },
      },
      {
        title: "数量",
        dataIndex: "quantity",
        valueType: "digit",
        formItemProps: {rules: [{ required: true, message: "请输入数量" }]},
      },
      {
        title: "组人数",
        dataIndex: "actual_group_size",
        valueType: "digit",
        formItemProps: {rules: [{ required: true, message: "请输入组人数" }]},
      },
      {
        title: "工资",
        dataIndex: "total_wage",
        valueType: "digit",
      },
      {
        title: "日期",
        dataIndex: "date",
        valueType: "date",
        initialValue: filterDate,
      },
      {
        title: "备注",
        dataIndex: "remark",
        valueType: "text",
        fieldProps: {
          maxLength: 200,
          showCount: true,
        },
      },
      {
        title: "操作",
        valueType: "option",
        width: 120,
        render: (_, record) => (
          <div>
            <Button type="link">
              编辑
            </Button>
            <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消">
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ]

  return (
    <>
      {contextHolder}
      <Typography.Title level={2}>日薪录入</Typography.Title>
      <Space>
        <ProFormSelect
          name="worker"
          label="工人"
          request={async () => {
            const result = await getWorkers();
            if (result.data) {
              return result.data.map((item) => ({ label: item.name, value: item.id })) || [];
            }
            return [];
          }}
          fieldProps={{
            showSearch: true,
            optionFilterProp: "label",
            value: filterWorker,
            onChange: setFilterWorker,
            allowClear: true,
          }}
        />
        <ProFormSelect
          name="process"
          label="工序"
          request={async () => {
            const result = await getProcesses();
            if (result.data) {
              return result.data.map((item) => ({ label: item.name, value: item.id })) || [];
            }
            return [];
          }}
          fieldProps={{
            showSearch: true,
            optionFilterProp: "label",
            value: filterProcess,
            onChange: setFilterProcess,
            allowClear: true,
          }}
        />
        <ProFormDatePicker name="data" label="日期" placeholder="选择日期" value={dayjs(filterDate)} />
      </Space>

      <EditableProTable<WageLog>
        rowKey="id"
        actionRef={editabelRef}
        columns={columns}
        value={wageLogs}
        loading={loading}
        editable={{
          type: "multiple",
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        recordCreatorProps={{
          position: "top",
          record: () => ({
            id: Date.now(),
            worker: "",
            worker_id: 0,
            process: "",
            process_id: 0,
            spec_model_id: 0,
            actual_price: 0,
            actual_group_size: 1,
            quantity: 0,
            group_size: 1,
            total_wage: 0,
            date: filterDate,
            remark: "",
          }),
        }}
      />
    </>
  );
};

export default WageLogCreatePage;
