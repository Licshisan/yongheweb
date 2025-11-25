import { Layout, theme } from "antd";
import { Menu } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  SearchOutlined,
  DollarOutlined,
  FileTextOutlined,
  UploadOutlined,
  PlusOutlined,
  CiOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const MenuList = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <AppstoreOutlined />,
      label: <Link to="/dashboard">仪表盘</Link>,
    },
    {
      key: "/worker",
      icon: <UserOutlined />,
      label: "工人信息",
      children: [
        {
          key: "/worker/list",
          icon: <CiOutlined />,
          label: <Link to="/worker/list">工人列表</Link>,
        },
        {
          key: "/worker/create",
          icon: <PlusOutlined />,
          label: <Link to="/worker/create">新增工人</Link>,
        },
      ],
    },
    {
      key: "/process",
      icon: <AppstoreOutlined />,
      label: "工序调整",
      children: [
        {
          key: "/process/list",
          icon: <CiOutlined />,
          label: <Link to="/process/list">工序列表</Link>,
        },
        {
          key: "/process/create",
          icon: <PlusOutlined />,
          label: <Link to="/process/create">创建工序</Link>,
        },
      ],
    },
    {
      key: "/spec-model",
      icon: <DollarOutlined />,
      label: "规格型号",
      children: [
        {
          key: "/spec-model/list",
          icon: <CiOutlined />,
          label: <Link to="/spec-model/list">规格型号列表</Link>,
        },
        {
          key: "/spec-model/create",
          icon: <PlusOutlined />,
          label: <Link to="/spec-model/create">创建规格型号</Link>,
        },
      ],
    },
    {
      key: "/wage_log",
      icon: <FileTextOutlined />,
      label: <Link to="/wage_log">日薪录入</Link>,
    },
    {
      key: "/wage_log_check",
      icon: <SearchOutlined />,
      label: <Link to="/wage_log_check">工资查询</Link>,
    },
    {
      key: "/salary_import",
      icon: <UploadOutlined />,
      label: <Link to="/salary_import">薪资导入</Link>,
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
