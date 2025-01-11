export const URL = "http://localhost:8080/api/";
// export const URL = "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/";

export const mathJaxConfig = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    packages: { "[+]": ["ams"] }  // ✅ AMS 패키지 활성화
  },
  loader: { load: [] }  // ✅ AMS는 기본 내장되어 있으므로 추가 로드 불필요
};

export type User = {
  id: number
  name: string
  userId: string
  userPw: string
  phone: string
  email: string
  authority: number
  contest: number
  createdAt: string
}

export type Contest = {
  id: number
  userId: string
  contestName: string
  contestDescription: string
  contestPw: string
  eventTime: string
  time: number
  createdAt: string
}

export type Problem = {
  id: number
  contestId: number
  userId: string
  problemName: string
  problemDescription: string
  problemInputDescription: string
  problemOutputDescription: string
  problemExampleInput: string
  problemExampleOutput: string
  createdAt: string
}

export type Example = {
  id: number
  problemId: number
  exampleInput: string
  exampleOutput: string
  createdAt: string
}

export type Solved = {
  id: number
  userId: string
  problemId: number
  score: string
  createdAt: string
}

export type ProblemDTO = {
  problem: Problem
  examples: Example[]
}

export type CodeDTO = {
  code: string
  lang: string
  problemId: number
}

export type ContestScore = {
  name: string
  solvedProblems: Submit[]
}

export type Submit = {
  problemId: number
  score: string
}

export type UserDTO = {
  id: number
  name: string
  userId: string
  email: string
  authority: number
  createdAt: string
}

export type ProblemsAndContestsDTO = {
  problems: Problem[]
  contests: Contest[]
}

export type CurrentContest = {
  contestId: number
  contestName: string
}

export const InitUser: User = { id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: -1, contest: -1, createdAt: '' };
export const InitCurrentContest: CurrentContest = { contestId: -1, contestName: '' };
export const InitExample: Example = { id: -1, problemId: -1, exampleInput: "", exampleOutput: "", createdAt: new Date().toISOString() };