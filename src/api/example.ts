import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";
import { Example } from '../types/entity/Example';

export const getAllExamplesByProblemId = async (problemId: number): Promise<ApiResponse<Example[]>> => {
  const response = await axios.get(`/examples/${problemId}`);
  return response.data;
};

export const deleteExampleById = async (id: number): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/examples/${id}`);
  return response.data;
};