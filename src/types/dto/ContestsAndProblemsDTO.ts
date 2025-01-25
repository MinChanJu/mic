import { Contest } from "../entity/Contest"
import { ProblemListDTO } from "./ProblemListDTO"

export type ContestsAndProblemsDTO = {
    contests: Contest[]
    problems: ProblemListDTO[]
  }