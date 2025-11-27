import { SpecModel } from './specModel';
import request from "../utils/request";
import { Process } from "./process";
import { Worker } from './worker'

// WageLog 类型定义
export interface WageLog {
  id: number;
  worker_id: number;
  process_id: number;
  spec_model_id: number;
  date: string;
  actual_price: number;
  actual_group_size: number;
  quantity: number;
  total_wage: number;
  remark?: string;
  worker?: Worker;
  process?: Process;
  spec_model?: SpecModel;
  created_at?: string;
  updated_at?: string;
}

// 获取所有工资记录
export const getWageLogs = async (date?: string) => {
  const response = await request.get("/wage_log/", { params: {date}});
  return response.data;
};

// 获取指定工序和规格型号的工价
export const getWagePriceByProcessAndSpec = async (processId: number, specModelId: number) => {
  const response = await request.get(`/wage_price/${processId}/${specModelId}`);
  return response.data; // 假设返回的数据包含 'wage_price' 字段

};

// 创建新的工资记录
export const createWageLog = async (wageLogData: Omit<WageLog, "id">) => {
  const response = await request.post("/wage_log/", wageLogData);
  return response.data; // 假设返回的是创建成功的工资记录
};

// 批量创建工资记录
export const batchCreateWageLogs = async (wageLogs: Omit<WageLog, "id">[]) => {
  // 假设后端提供 /wage_log/batch POST 接口接收数组
  const response = await request.post("/wage_log/batch_import", wageLogs);
  return response.data; // 返回批量创建结果
};

// 更新工资记录
export const updateWageLog = async (id: number, wageLogData: WageLog) => {
  const response = await request.put(`/wage_log/${id}`, wageLogData);
  return response.data; // 假设返回的是更新后的工资记录
};

// 删除工资记录
export const deleteWageLog = async (id: number) => {
  const response = await request.delete(`/wage_log/${id}`);
  return response.data; // 假设返回的是删除结果

};

// 获取指定 ID 的工资记录
export const getWageLogById = async (id: number) => {
  const response = await request.get(`/wage_log/${id}`);
  return response.data; // 假设后端返回的是一个 WageLog 对象

};

// 根据指定日期获取工资记录
export const getWageLogsByDate = async (date: string) => {
  const response = await request.get("/wage_log/", {
    params: { date }, // 假设后端通过 query 参数 ?date=yyyy-mm-dd 来筛选
  });
  return response.data; // 返回的数据结构应与 getWageLogs 相同

};

// 日期区间、工人、工序联合查询
export const getFilteredWageLogs = async (params: {
  start_date?: string;
  end_date?: string;
  worker_id?: number | string;
  process_id?: number | string;
  //page?: number;
  //page_size?: number;
}) => {
  const response = await request.get("/wage_log/query", { params });
  return response.data;
};
