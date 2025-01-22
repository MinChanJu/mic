import { Contest } from "../entity/Contest"
import { Problem } from "../entity/Problem"

export type ContestsAndProblemsDTO = {
    contests: Contest[]
    problems: Problem[]
  }