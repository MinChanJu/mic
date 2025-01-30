import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";
import { CodeDTO } from '../types/dto/CodeDTO';

const url = '/data'

export const getAllFilterContestsAndProblems = async (): Promise<ApiResponse<string>> => {    // ContestsAndProblemsDTO
  const response = await axios.get(`${url}/filter`);
  return response.data;
};

export const getScoreBoardByContestId = async (contestId: number): Promise<ApiResponse<string>> => {    // ScoreBoardDTO
  const response = await axios.get(`${url}/${contestId}`);
  return response.data;
};

export const runCode = async (codeDTO: CodeDTO): Promise<ApiResponse<string>> => {    // CodeResultDTO
  const response = await axios.post(`${url}/code`, codeDTO);
  return response.data;
};