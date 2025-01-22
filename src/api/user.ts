import axios from './axiosInstance';
import { ApiResponse } from '../types/dto/ApiResponse';
import { User } from '../types/entity/User';
import { UserDTO } from '../types/dto/UserDTO';

interface UserLoginDTO {
  userId: string;
  userPw: string;
}

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await axios.get('/users');
  return response.data;
};

export const getUserByUserId = async (userId: string): Promise<ApiResponse<UserDTO>> => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};

export const login = async (loginData: UserLoginDTO): Promise<ApiResponse<User>> => {
  const response = await axios.post('/users/login', loginData);
  return response.data;
};

export const register = async (userDetail: User): Promise<ApiResponse<User>> => {
  const response = await axios.post('/users/create', userDetail);
  return response.data;
};

export const updateUser = async (userDetail: User): Promise<ApiResponse<User>> => {
  const response = await axios.put('/users/update', userDetail);
  return response.data;
};

export const deleteUserById = async (id: number): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};