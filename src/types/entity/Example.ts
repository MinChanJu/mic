export type Example = {
  id: number | null
  problemId: number
  userId: string
  exampleInput: string
  exampleOutput: string
  createdAt: string
}

export const InitExample: Example = {
  id: null,
  problemId: -1,
  userId: "",
  exampleInput: "",
  exampleOutput: "",
  createdAt: new Date().toISOString()
};
