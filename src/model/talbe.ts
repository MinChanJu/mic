export type User = {
  id: number,
  name: string,
  userId: string,
  userPw: string,
  phone: string,
  email: string,
  authority: number,
  contest: number,
  createdAt: string,
}

export type Contest = {
  id: number,
  userId: string,
  contestName: string,
  contestDescription: string,
  contestPw: string,
  eventTime: string,
  createdAt: string,
}

export type Problem = {
  id: number,
  contestId: number,
  contestName: string;
  userId: string,
  problemName: string,
  problemDescription: string,
  problemInputDescription: string,
  problemOutputDescription: string,
  problemExampleInput: string,
  problemExampleOutput: string,
  createdAt: string,
}

export type Example = {
  id: number,
  problemId: number,
  exampleInput: string,
  exampleOutput: string,
  createdAt: string
}

export type CurrentContest = {
  contestId: number,
  contestName: string
}

export type Code = {
  code: string,
  lang: string,
  problemId: number
}

export type ProblemDTO = {}