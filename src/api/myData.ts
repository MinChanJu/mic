import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";
import { ContestsAndProblemsDTO } from '../types/dto/ContestsAndProblemsDTO';
import { ContestScoreDTO } from '../types/dto/ContestScoreDTO';
import { CodeDTO } from '../types/dto/CodeDTO';
import { CodeResultDTO } from '../types/dto/CodeResultDTO';

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