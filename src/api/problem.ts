import axios from './axiosInstance';
import { ApiResponse } from '../types/ApiResponse';
import { Problem } from '../types/Problem';
import { ProblemDTO } from '../types/ProblemDTO';
import { ProblemScoreDTO } from '../types/ProblemScoreDTO';

export const getAllProblems = async (): Promise<ApiResponse<Problem[]>> => {
  const response = await axios.get(`/problems`);
  return response.data;
};

export const getProblemById = async (id: number): Promise<ApiResponse<Problem>> => {
  const response = await axios.get(`/problems/${id}`);
  return response.data;
};

export const getAllProblemsByContestId = async (contestId: number): Promise<ApiResponse<Problem[]>> => {
  const response = await axios.get(`/problems/contest/${contestId}`);
  return response.data;
};

export const getAllProblemsByUserId = async (userId: string): Promise<ApiResponse<Problem[]>> => {
  const response = await axios.get(`/problems/user/${userId}`);
  return response.data;
};

export const getAllSolveProblemsByUserId = async (userId: string): Promise<ApiResponse<ProblemScoreDTO[]>> => {
  const response = await axios.get(`/problems/solve/${userId}`);
  return response.data;
};

export const createProblem = async (problemDTO: ProblemDTO): Promise<ApiResponse<Problem>> => {
  const response = await axios.post('/problems/create', problemDTO);
  return response.data;
};

export const updateProblem = async (problemDTO: ProblemDTO): Promise<ApiResponse<Problem>> => {
  const response = await axios.put('/problems/update', problemDTO);
  return response.data;
};

export const deleteProblemById = async (id: number): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/problems/${id}`);
  return response.data;
};