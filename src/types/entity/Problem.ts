export type Problem = {
  id: number | null
  contestId: number
  userId: string
  problemName: string
  problemDescription: string
  problemInputDescription: string
  problemOutputDescription: string
  problemExampleInput: string
  problemExampleOutput: string
  createdAt: string
}

export const InitProblem: Problem = {
  id: null,
  contestId: -1,
  userId: '',
  problemName: '',
  problemDescription: '',
  problemInputDescription: '',
  problemOutputDescription: '',
  problemExampleInput: '',
  problemExampleOutput: '',
  createdAt: ''
};