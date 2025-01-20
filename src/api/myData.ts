import axios from './axiosInstance';
import { ApiResponse } from "../types/ApiResponse";
import { ContestsAndProblemsDTO } from '../types/ContestsAndProblemsDTO';
import { ContestScoreDTO } from '../types/ContestScoreDTO';
import { CodeDTO } from '../types/CodeDTO';
import { CodeResultDTO } from '../types/CodeResultDTO';

export const getAllContestsAndProblems = async (): Promise<ApiResponse<ContestsAndProblemsDTO>> => {
  const response = await axios.get('/data');
  return response.data;
};

export const getAllFilterContestsAndProblems = async (): Promise<ApiResponse<ContestsAndProblemsDTO>> => {
  const response = await axios.get('/data/filter');
  return response.data;
};

export const getScoreBoardByContestId = async (contestId: number): Promise<ApiResponse<ContestScoreDTO[]>> => {
  const response = await axios.get(`/data/${contestId}`);
  return response.data;
};

export const runCode = async (codeDTO: CodeDTO): Promise<ApiResponse<CodeResultDTO>> => {
  const response = await axios.post('/data/code', codeDTO);
  return response.data;
};