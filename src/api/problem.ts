import axios from './axiosInstance';
import { ApiResponse } from '../types/dto/ApiResponse';
import { ProblemDTO } from '../types/dto/ProblemDTO';

const url = '/problems'

export const getProblemList = async (): Promise<ApiResponse<string>> => {   // ProblemListDTO[]
  let response = await axios.get(`${url}/all`);
  return response.data;
};

export const getProblemListByContestId = async (contestId: number): Promise<ApiResponse<string>> => {   // ProblemListDTO[]
  let response = await axios.get(`${url}/contest/${contestId}`);
  return response.data;
};

export const getProblemById = async (id: number): Promise<ApiResponse<string>> => {   // ProblemScoreDTO
  const response = await axios.get(`${url}/${id}`);
  return response.data;
};

export const getAllProblemsByUserId = async (userId: string): Promise<ApiResponse<string>> => {   // Problem[]
  const response = await axios.get(`${url}/user/${userId}`);
  return response.data;
};

export const getAllSolveProblemsByUserId = async (userId: string): Promise<ApiResponse<string>> => {    // ProblemScoreDTO[]
  const response = await axios.get(`${url}/solve/${userId}`);
  return response.data;
};

export const createProblem = async (problemDTO: ProblemDTO): Promise<ApiResponse<string>> => {    // Problem
  const response = await axios.post(`${url}/create`, problemDTO);
  return response.data;
};

export const updateProblem = async (problemDTO: ProblemDTO): Promise<ApiResponse<string>> => {    // Problem
  const response = await axios.put(`${url}/update`, problemDTO);
  return response.data;
};

export const deleteProblemById = async (id: number): Promise<ApiResponse<string>> => {    // Void
  const response = await axios.delete(`${url}/${id}`);
  return response.data;
};