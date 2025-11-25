import request, { ResponseData } from "../utils/request";
import { Process } from "./process";

export interface Worker {
  id: number;
  name: string;
  id_card?: string;
  remark?: string;
  group?: string;
  process_id?: number;
  entry_date?: string;
  leave_date?: string;
  status?: string;
  process?: Process
}

export async function createWorker(worker: Partial<Worker>): Promise<ResponseData<Worker>> {
  const response = await request.post("/worker/", worker);
  return response.data;
}

export async function deleteWorker(id: number): Promise<ResponseData> {
  const response = await request.delete(`/worker/${id}`);
  return response.data;
}

export async function updateWorker(id: number, worker: Partial<Worker>): Promise<ResponseData> {
  const response = await request.put(`/worker/${id}`, worker);
  return response.data;
}

export async function getWorker(id: number): Promise<ResponseData<Worker>> {
  const response = await request.get(`/worker/${id}`);
  return response.data;
}

export async function getWorkers(): Promise<ResponseData<Worker[]>> {
  const response = await request.get("/worker/");
  return response.data;
}

// 根据指定日期在岗的工人
export async function getWorkersBySearchDate(date: string): Promise<ResponseData<Worker[]>> {
  const response = await request.get("/worker/", { params: { date } });
  return response.data;
}
