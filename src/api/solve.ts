import axios from './axiosInstance';
import { ApiResponse } from '../types/dto/ApiResponse';

const url = '/solves'

export const getAllSolvesByUserId = async (userId: string): Promise<ApiResponse<string>> => {   // Solve[]
  const response = await axios.get(`${url}/users/${userId}`);
  return response.data;
};

export const getAllSolvesByProblemId = async (problemId: number): Promise<ApiResponse<string>> => {   // Solve[]
  const response = await axios.get(`${url}/problem/${problemId}`);
  return response.data;
};