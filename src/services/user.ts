import request from '../utils/request';

export async function login(username: string, password: string) {
  try {
    const res = await request.post('/user/login', { username, password });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function register(username: string, password: string) {
  try {
    const res = await request.post('/user/register', { username, password });
    return res.data;
  } catch (error) {
    throw error;
  }
}
