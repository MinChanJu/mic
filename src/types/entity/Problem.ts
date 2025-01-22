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