import request, { ResponseData } from "../utils/request";

// 工序接口
export interface Process {
  id: number;
  name: string;
  description: string;
}

// 查找单个工序
export async function getProcess(id: number): Promise<ResponseData<Process>> {
  const response = await request.get(`/process/${id}`);
  return response.data;
};

// 获取所有工序
export async function getProcesses(): Promise<ResponseData<Process[]>> {
  const response = await request.get("/process/");
  return response.data;

};

// 创建工序（不包括 ID）
export async function createProcess(processData: Omit<Process, "id">): Promise<ResponseData> {
  const response = await request.post("/process/", processData);
  return response.data;

};

// 更新工序
export async function updateProcess(id: number, processData: Partial<Process>): Promise<ResponseData> {
  const response = await request.put(`/process/${id}`, processData);
  return response.data;
};

// 删除工序
export async function deleteProcess(id: number): Promise<ResponseData> {
  const response = await request.delete(`/process/${id}`);
  return response.data;
};
