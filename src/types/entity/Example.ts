export type Example = {
    id: number | null
    problemId: number
    exampleInput: string
    exampleOutput: string
    createdAt: string
  }

export const InitExample: Example = { id: null, problemId: -1, exampleInput: "", exampleOutput: "", createdAt: new Date().toISOString() };
