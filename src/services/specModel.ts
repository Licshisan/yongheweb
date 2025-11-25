import request from "../utils/request";
import { Process } from "./process";

// 规格型号接口
export interface SpecModel {
  id: number;
  name: string;
  category: string;
  process_id: number;
  price: number;
  process?: Process
}

// 获取所有规格型号
export const getSpecModels = async () => {
  const response = await request.get("/spec_model/");
  return response.data; // 假设返回的数据中包含 specModels 数组
};

export const getSpecModel = async (id: Number) => {
  const response = await request.get(`/spec_model/${id}`);
  return response.data; // 假设返回的数据中包含 specModels 数组
};

// 创建规格型号（不包括 ID）
export const createSpecModel = async (specData: Omit<SpecModel, "id">) => {
  const response = await request.post("/spec_model/", specData);
  return response.data; // 返回创建的规格型号
};

// 更新规格型号（部分字段可更新）
export const updateSpecModel = async (id: number, specData: Partial<SpecModel>) => {
  const response = await request.put(`/spec_model/${id}`, specData);
  return response.data; // 返回更新后的规格型号
};

// 删除规格型号
export const deleteSpecModel = async (id: number) => {
  const response = await request.delete(`/spec_model/${id}`);
  return response.data; // 返回删除结果
};

// 获取指定工序下的所有规格型号
export const getSpecModelsByProcess = async (processId: number) => {
  const response = await request.get(`/spec_model/by_process/${processId}`);
  return response.data; // 假设返回的数据结构是 { spec_models: SpecModel[] }
};
