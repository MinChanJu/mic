import axios from './axiosInstance';
import { ApiResponse } from '../types/ApiResponse';
import { Solve } from '../types/Solve';

export const getAllSolvesByUserId = async (userId: string): Promise<ApiResponse<Solve[]>> => {
  const response = await axios.get(`/solves/users/${userId}`);
  return response.data;
};

export const getAllSolvesByProblemId = async (problemId: number): Promise<ApiResponse<Solve[]>> => {
  const response = await axios.get(`/solves/problem/${problemId}`);
  return response.data;
};

export const solveProblem = async (solveDetail: Solve): Promise<ApiResponse<Solve>> => {
  const response = await axios.post(`/solves`, solveDetail);
  return response.data;
};