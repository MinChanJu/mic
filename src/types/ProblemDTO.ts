import { Example } from "./Example"
import { Problem } from "./Problem"

export type ProblemDTO = {
    problem: Problem
    examples: Example[]
  }