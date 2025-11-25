import exp from "constants";
import request, { ResponseData } from "../utils/request";

interface User {
  id: number;
  username: string;
}

export async function login(username: string, password: string): Promise<ResponseData & { token: string }> {
  const response = await request.post("/user/login", { username, password });
  return response.data;
}

export async function register(username: string, password: string): Promise<ResponseData<User>> {
  const response = await request.post("/user/register", { username, password });
  return response.data;
}

export async function getUserInfo(): Promise<ResponseData<User>> {
  const response = await request.get("/user/info");
  return response.data;
}