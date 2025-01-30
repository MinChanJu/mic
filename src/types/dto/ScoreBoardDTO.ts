import { ContestListDTO } from "./ContestListDTO"
import { ContestScoreDTO } from "./ContestScoreDTO"
import { ProblemListDTO } from "./ProblemListDTO"

export type ScoreBoardDTO = {
  contest: ContestListDTO
  problemList: ProblemListDTO[]
  contestScores: ContestScoreDTO[]
}