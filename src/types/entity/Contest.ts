export type Contest = {
  id: number | null
  userId: string
  contestName: string
  contestDescription: string
  contestPw: string | null
  startTime: string | null
  endTime: string | null
  createdAt: string
}

export const InitContest: Contest = { id: null, userId: '', contestName: '', contestDescription: '', contestPw: null, startTime: null, endTime: null, createdAt: '' };