import React, { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Form, DatePicker, Select, Button, Statistic, message, Typography } from "antd";
import dayjs from "dayjs";
import { getWorkers, Worker } from "../../services/worker";
import { getProcesses, Process } from "../../services/process";
import { getFilteredWageLogs, WageLog } from "../../services/wageLogs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { ProColumns } from "@ant-design/pro-components";

const WageLogSearchPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [dataSource, setDataSource] = useState<WageLog[]>([]);
  const [totalWage, setTotalWage] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 加载工人
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const result = await getWorkers();
        if (result.data) {
          setWorkers(result.data);
        }
      } catch (error) {
        console.error("加载工人失败:", error);
      }
    };
    loadWorkers();
  }, []);

  // 加载工序
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const result = await getProcesses();
        if (result.data) {
          setProcesses(result.data);
        }
      } catch (error) {
        console.error("加载工序失败:", error);
      }
    };
    loadProcesses();
  }, []);

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const result = await getFilteredWageLogs({
        start_date: values.dateRange?.[0]?.format("YYYY-MM-DD"),
        end_date: values.dateRange?.[1]?.format("YYYY-MM-DD"),
        worker_id: values.workerId || "",
        process_id: values.process_id || "",
      });
      if (result.data) {
        setDataSource(result.data || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.length || 0,
        }));
      }

      // 计算工资总和
      const total = (result.data || []).reduce((sum: number, item: WageLog) => sum + Number(item.total_wage), 0);
      setTotalWage(total);
    } catch (error: any) {
      console.error("加载日薪记录失败:", error);
      messageApi.error("加载日薪记录失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 导出数据到Excel表中
  const exportToExcel = () => {
    if (!dataSource.length) return;

    // 获取所有日期（升序）
    const allDates = Array.from(new Set(dataSource.map((item) => item.date))).sort();

    // 获取所有工人
    const allWorkers = Array.from(new Set(dataSource.map((item) => item.worker)));

    // 构造表格数据
    const data: any[] = [];

    allWorkers.forEach((worker) => {
      const row: any = { 工人: worker };
      let total = 0;

      allDates.forEach((date) => {
        const logs = dataSource.filter((item) => item.worker === worker && item.date === date);
        const wage = logs.reduce((sum, item) => sum + item.total_wage, 0);
        row[date] = wage;
        total += wage;
      });

      row["工资合计"] = total;
      data.push(row);
    });

    // 创建 worksheet 和 workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "工资报表");

    // 获取文件名
    const start = form.getFieldValue("dateRange")?.[0]?.format("YYYY-MM-DD") || "";
    const end = form.getFieldValue("dateRange")?.[1]?.format("YYYY-MM-DD") || "";
    const filename = `工资报表_${start}_${end}.xlsx`;

    // 导出
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  // 导出查询记录
  // 导出查询记录
  const exportToExcelDaily = () => {
    if (!dataSource.length) {
      message.warning("没有数据可导出");
      return;
    }

    try {
      // 获取所有日期（去重并排序，并格式化为 YYYY-MM-DD）
      const allDates = Array.from(new Set(dataSource.map((item) => item.date)))
        .filter((date) => date) // 过滤掉空日期
        .sort()
        .map((date) => dayjs(date).format("YYYY-MM-DD")); // 统一格式化日期

      // 获取所有工人（基于 worker_id 去重）
      const allWorkers = Array.from(
        new Map(
          dataSource.filter((item) => item.worker && item.worker.id).map((item) => [item?.worker?.id, item.worker])
        ).values()
      );

      if (allWorkers.length === 0) {
        message.warning("没有有效的工人数据");
        return;
      }

      const data: any[] = [];

      allWorkers.forEach((worker) => {
        const row: any = { 工人: worker?.name || "未知工人" };
        let total = 0;

        allDates.forEach((formattedDate) => {
          // 查找对应日期的记录，需要将原始日期也格式化为 YYYY-MM-DD 进行比较
          const logs = dataSource.filter((item) => {
            const itemDate = item.date ? dayjs(item.date).format("YYYY-MM-DD") : "";
            return item.worker?.id === worker?.id && itemDate === formattedDate;
          });

          const wage = logs.reduce((sum, item) => sum + (Number(item.total_wage) || 0), 0);
          row[formattedDate] = wage; // 使用格式化后的日期作为键
          total += wage;
        });

        row["工资合计"] = total;
        data.push(row);
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "工资日薪表");

      // 设置列宽（可选，让显示更美观）
      if (!worksheet["!cols"]) {
        worksheet["!cols"] = [];
      }
      // 设置工人列宽度
      worksheet["!cols"][0] = { width: 15 };
      // 设置日期列宽度
      for (let i = 1; i <= allDates.length; i++) {
        worksheet["!cols"][i] = { width: 12 };
      }
      // 设置合计列宽度
      worksheet["!cols"][allDates.length + 1] = { width: 12 };

      // 生成文件名
      const dateRange = form.getFieldValue("dateRange");
      let filename = "工资报表";

      if (dateRange?.[0] && dateRange?.[1]) {
        const start = dayjs(dateRange[0]).format("YYYY-MM-DD");
        const end = dayjs(dateRange[1]).format("YYYY-MM-DD");
        filename = `工资报表_${start}_${end}.xlsx`;
      } else {
        filename = `工资报表_${dayjs().format("YYYY-MM-DD")}.xlsx`;
      }

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, filename);

      message.success("导出成功");
    } catch (error) {
      console.error("导出Excel失败:", error);
      message.error("导出失败，请重试");
    }
  };
  // 导出前查询记录排序
  const exportToExcelRaw = () => {
    if (!dataSource.length) return;

    // 转换为导出格式
    const exportData = dataSource.map((item) => ({
      工人: item.worker?.name || "",
      工序: item.process?.name || "",
      组人数: item.actual_group_size,
      规格型号: item.spec_model?.name || "",
      日期: dayjs(item.date).format("YYYY-MM-DD"),
      数量: item.quantity,
      单价: item.actual_price,
      工资: item.total_wage,
      备注: item.remark || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "工资记录");

    const start = form.getFieldValue("dateRange")?.[0]?.format("YYYY-MM-DD") || "";
    const end = form.getFieldValue("dateRange")?.[1]?.format("YYYY-MM-DD") || "";
    const filename = `查询记录_${start}_${end}.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  const columns: ProColumns<WageLog>[] = [
    {
      title: "日期",
      dataIndex: "date",
      valueType: "text",
      render: (text) => {
        if (!text) return "-";
        return dayjs(text as string).format("YYYY-MM-DD");
      },
    },
    {
      title: "工人",
      dataIndex: ["worker", "name"],
      valueType: "text",
    },
    {
      title: "工序",
      dataIndex: ["process", "name"],
      valueType: "text",
    },
    {
      title: "规格型号",
      dataIndex: ["spec_model", "name"],
      valueType: "text",
    },
    {
      title: "单价",
      dataIndex: "actual_price",
      valueType: "money",
    },
    { title: "数量", dataIndex: "quantity" },
    {
      title: "组人数",
      dataIndex: "actual_group_size",
    },
    {
      title: "工资",
      dataIndex: "total_wage",
      valueType: "money",
    },
    { title: "备注", dataIndex: "remark" },
  ];

  return (
    <>
      {contextHolder}
      <Typography.Title level={2}>日薪查询</Typography.Title>
      <Form
        form={form}
        layout="inline"
        initialValues={{
          dateRange: [dayjs(), dayjs()],
        }}
        onFinish={() => {
          setPagination({ ...pagination, current: 1 }); // 重置分页
          fetchData();
        }}
      >
        <Form.Item name="dateRange" label="日期区间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="workerId" label="工人">
          <Select
            showSearch
            placeholder="请输入工人姓名"
            style={{ width: 200 }}
            filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
            options={workers.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item name="process_id" label="工序">
          <Select
            showSearch
            placeholder="选择工序"
            style={{ width: 160 }}
            filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
            options={processes.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <Statistic title="工资总和" value={totalWage} precision={2} prefix="¥" />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button onClick={exportToExcelDaily} type="default">
            导出日薪工资记录
          </Button>
          <Button onClick={exportToExcelRaw} type="default">
            导出查询记录
          </Button>
        </div>
      </div>

      <ProTable<WageLog>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: false,
          onChange: (page) => setPagination((prev) => ({ ...prev, current: page })),
        }}
        search={false}
        toolBarRender={false}
      />
    </>
  );
};

export default WageLogSearchPage;
