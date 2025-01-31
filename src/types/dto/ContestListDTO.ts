export type ContestListDTO = {
  id: number;
  contestId: number;
  contestName: string;
  contestDescription: string;
  userId: string;
  startTime: string | null;
  endTime: string | null;
}