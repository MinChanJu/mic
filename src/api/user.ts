import axios from './axiosInstance';
import { ApiResponse } from '../types/dto/ApiResponse';
import { UserLoginDTO } from '../types/dto/UserLoginDTO';
import { User } from '../types/entity/User';

const url = '/users'

export const getAllUsers = async (): Promise<ApiResponse<string>> => {    // User[]
  const response = await axios.get(`${url}`);
  return response.data;
};

export const getAllUsersByContestId = async (contestId: number): Promise<ApiResponse<string>> => {  // User[]
  const response = await axios.get(`${url}/contest/${contestId}`);
  return response.data;
};

export const getUserByUserId = async (userId: string): Promise<ApiResponse<string>> => {    // UserDTO
  const response = await axios.get(`${url}/${userId}`);
  return response.data;
};

export const login = async (loginData: UserLoginDTO): Promise<ApiResponse<string>> => {   // UserResponseDTO
  const response = await axios.post(`${url}/login`, loginData);
  return response.data;
};

export const register = async (userDetail: User): Promise<ApiResponse<string>> => {   // User
  const response = await axios.post(`${url}/create`, userDetail);
  return response.data;
};

export const updateUser = async (userDetail: User): Promise<ApiResponse<string>> => {   // User
  const response = await axios.put(`${url}/update`, userDetail);
  return response.data;
};

export const deleteUserById = async (id: number): Promise<ApiResponse<string>> => {   // Void
  const response = await axios.delete(`${url}/${id}`);
  return response.data;
};