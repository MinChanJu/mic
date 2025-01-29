import { ContestListDTO } from "./ContestListDTO"
import { ProblemListDTO } from "./ProblemListDTO"

export type ContestsAndProblemsDTO = {
    contests: ContestListDTO[]
    problems: ProblemListDTO[]
  }