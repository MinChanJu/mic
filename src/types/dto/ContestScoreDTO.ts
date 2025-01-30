import { SubmitDTO } from "./SubmitDTO"

export type ContestScoreDTO = {
  id: number
  name: string
  solveProblems: SubmitDTO[]
}