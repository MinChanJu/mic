import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";

export const getResult = async <T>(data: string, resultId: string): Promise<ApiResponse<T>> => {
  const response = await axios.get(`/${data}/result/${resultId}`);
  return response.data;
};