import axios from './axiosInstance';
import { ApiResponse } from '../types/dto/ApiResponse';
import { Problem } from '../types/entity/Problem';
import { ProblemDTO } from '../types/dto/ProblemDTO';
import { ProblemScoreDTO } from '../types/dto/ProblemScoreDTO';
import { ProblemListDTO } from '../types/dto/ProblemListDTO';

export const getProblemListWithUserId = async (userId: string): Promise<ApiResponse<ProblemListDTO[]>> => {
  let response;
  if (userId === '') response = await axios.get(`/problems/all`);
  else response = await axios.get(`/problems/all/${userId}`);

  return response.data;
};

export const getProblemListByContestIdWithUserId = async (contestId: number, userId: string): Promise<ApiResponse<ProblemListDTO[]>> => {
  let response;
  if (userId === '') response = await axios.get(`/problems/contest/${contestId}`);
  else response = await axios.get(`/problems/contest/${contestId}/${userId}`);
  return response.data;
};

export const getProblemById = async (id: number): Promise<ApiResponse<Problem>> => {
  const response = await axios.get(`/problems/${id}`);
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