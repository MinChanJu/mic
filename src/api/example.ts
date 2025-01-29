import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";

const url = '/examples'

export const getAllExamplesByProblemId = async (problemId: number): Promise<ApiResponse<string>> => {
  const response = await axios.get(`${url}/${problemId}`);
  return response.data;
};

export const deleteExampleById = async (id: number): Promise<ApiResponse<string>> => {    // Void
  const response = await axios.delete(`${url}/${id}`);
  return response.data;
};