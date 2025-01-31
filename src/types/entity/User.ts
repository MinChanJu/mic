export type User = {
  id: number | null
  name: string
  userId: string
  userPw: string
  phone: string
  email: string
  authority: number
  contestId: number
  createdAt: string
}

export const InitUser: User = {
  id: null,
  name: '',
  userId: '',
  userPw: '',
  phone: '',
  email: '',
  authority: -1,
  contestId: -1,
  createdAt: ''
};