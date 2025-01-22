import { Problem } from "../entity/Problem"
import { Example } from "../entity/Example"

export type ProblemDTO = {
    problem: Problem
    examples: Example[]
  }