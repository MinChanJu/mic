export type ContestListDTO = {
    id: number;
    contestId: number;
    contestName: string;
    userId: string;
    startTime: string | null;
    endTime: string | null;
}