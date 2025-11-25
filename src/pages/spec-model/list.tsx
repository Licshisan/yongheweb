import React, { useState, useEffect } from "react";
import { Button, Input, Table, Typography, Popconfirm, TableColumnsType, message } from "antd";
import { getSpecModels,  deleteSpecModel, SpecModel } from "../../services/specModel";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { Process } from "../../services/process";

const SpecModelListPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [specModels, setSpecModels] = useState<SpecModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadSpecModels = async () => {
    try {
      setLoading(true);
      const result = await getSpecModels();
      if (result.data) {
        console.log(result.data);
        const filteredSpecModels = result.data.filter((specModel: SpecModel) =>
          specModel.name.toLowerCase().includes(search.toLowerCase()),
        );
        setSpecModels(filteredSpecModels);
      }
    } catch (error: any) {
      console.error("加载规格型号失败:", error);
      messageApi.warning(error.response?.data?.msg || "加载规格型号失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    loadSpecModels();
  };

  // 导出 Excel
  const handleExport = () => {
    const filteredSpecModels = specModels.filter((specModel: SpecModel) =>
      specModel.name.toLowerCase().includes(search.toLowerCase()),
    );
    const exportData = filteredSpecModels.map((spec) => {
      return {
        规格名称: spec.name,
        工序: spec.process?.name || "-",
        分类: spec.category,
        工价: spec.price,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "规格型号");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "规格型号.xlsx");
  };

  const handleEdit = (specModel: SpecModel) => {
    navigate(`/spec-model/create?id=${specModel.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSpecModel(id);
      loadSpecModels();
    } catch (error: any) {
      console.error("删除规格型号失败:", error);
      messageApi.warning(error.response?.data?.msg || "删除规格型号失败");
    }
  };

  useEffect(() => {
    loadSpecModels();
  }, []);

  const columns: TableColumnsType<SpecModel> = [
    {
      title: "规格名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "工序",
      dataIndex: "process",
      key: "process",
      render: (process: Process) => process?.name,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "工价",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      render: (_: any, record: SpecModel) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Typography.Title level={3}>规格型号管理</Typography.Title>
      <Input.Search placeholder="按工序名称搜索" onSearch={handleSearch} style={{ width: 300, marginBottom: 20 }} />
      <Button style={{ float: "right" }} onClick={handleExport}>
        导出查询结果
      </Button>
      <Table loading={loading} dataSource={specModels} columns={columns} rowKey="id" pagination={false} />
    </>
  );
};


export default SpecModelListPage;
