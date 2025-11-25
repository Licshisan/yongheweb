import { Layout, theme } from "antd";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SearchOutlined,
  ApartmentOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  EditOutlined,
  FileAddOutlined,
  ImportOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const MenuList = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />, // 专门的仪表盘图标
      label: <Link to="/dashboard">仪表盘</Link>,
    },
    {
      key: "/worker",
      icon: <TeamOutlined />, // 团队/人员图标
      label: "工人信息",
      children: [
        {
          key: "/worker/list",
          icon: <TeamOutlined />, // 人员列表
          label: <Link to="/worker/list">工人列表</Link>,
        },
        {
          key: "/worker/create",
          icon: <UserAddOutlined />, // 添加用户
          label: <Link to="/worker/create">新增工人</Link>,
        },
      ],
    },
    {
      key: "/process",
      icon: <ApartmentOutlined />, // 流程/工序图标
      label: "工序调整",
      children: [
        {
          key: "/process/list",
          icon: <SettingOutlined />, // 设置/配置
          label: <Link to="/process/list">工序列表</Link>,
        },
        {
          key: "/process/create",
          icon: <PlusCircleOutlined />, // 创建添加
          label: <Link to="/process/create">创建工序</Link>,
        },
      ],
    },
    {
      key: "/spec-model",
      icon: <BarcodeOutlined />, // 规格/条码图标
      label: "规格型号",
      children: [
        {
          key: "/spec-model/list",
          icon: <AppstoreOutlined />, // 应用/规格列表
          label: <Link to="/spec-model/list">规格型号列表</Link>,
        },
        {
          key: "/spec-model/create",
          icon: <FileAddOutlined />, // 文件添加
          label: <Link to="/spec-model/create">创建规格型号</Link>,
        },
      ],
    },
    {
      key: "/wage_log",
      icon: <DollarCircleOutlined />, // 金钱/薪资图标
      label: "薪资管理",
      children: [
        {
          key: "/wage_log/create",
          icon: <EditOutlined />, // 编辑/录入
          label: <Link to="/wage_log/create">日薪录入</Link>,
        },
        {
          key: "/wage_log/list",
          icon: <SearchOutlined />, // 搜索/查询
          label: <Link to="/wage_log/list">工资查询</Link>,
        },
        {
          key: "/wage_log/import",
          icon: <ImportOutlined />, // 导入
          label: <Link to="/wage_log/import">薪资导入</Link>,
        },
      ],
    },
  ];

  return (
    <>
      <div style={{ color: "white", textAlign: "center", lineHeight: "64px" }}>我的应用</div>
      <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
    </>
  );
};

const MainLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider width={200}>
        <MenuList />
      </Layout.Sider>
      <Layout>
        <Layout.Content style={{ margin: "16px", background: colorBgContainer, padding: 24 }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
