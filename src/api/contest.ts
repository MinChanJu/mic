import axios from './axiosInstance';
import { ApiResponse } from "../types/dto/ApiResponse";
import { Contest } from '../types/entity/Contest';

const url = '/contests'

export const getContestList = async (): Promise<ApiResponse<string>> => {   // ContestListDTO[]
  const response = await axios.get(`${url}/all`);
  return response.data;
};

export const getContestListByUserId = async (userId: string): Promise<ApiResponse<string>> => {   // ContestListDTO[]
  const response = await axios.get(`${url}/all/${userId}`);
  return response.data;
};

export const getContestById = async (id: number): Promise<ApiResponse<string>> => {   // ContestListDTO[] - 길이 1
  const response = await axios.get(`${url}/${id}`);
  return response.data;
};

export const createContest = async (contestDetail: Contest): Promise<ApiResponse<string>> => {    // Contest
  const response = await axios.post(`${url}/create`, contestDetail);
  return response.data;
};

export const updateContest = async (contestDetail: Contest): Promise<ApiResponse<string>> => {    // Contest
  const response = await axios.put(`${url}/update`, contestDetail);
  return response.data;
};

export const deleteContestById = async (id: number): Promise<ApiResponse<string>> => {    // Void
  const response = await axios.delete(`${url}/${id}`);
  return response.data;
};