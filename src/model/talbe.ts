declare const process: {
  env: {
    NODE_ENV: string;
  };
};

export const URL = process.env.NODE_ENV === 'production'
  ? "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/"  // 배포 서버 주소
  : "http://localhost:8080/api/"; 

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
  contestId: number
  createdAt: string
}

export type Contest = {
  id: number
  userId: string
  contestName: string
  contestDescription: string
  contestPw: string
  time: number
  eventTime: string
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

export type Solve = {
  id: number
  userId: string
  problemId: number
  score: number
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

export type ContestScoreDTO = {
  name: string
  solveProblems: SubmitDTO[]
}

export type SubmitDTO = {
  problemId: number
  score: number
}

export type UserDTO = {
  id: number
  name: string
  userId: string
  email: string
  authority: number
  createdAt: string
}

export type ContestsAndProblemsDTO = {
  contests: Contest[]
  problems: Problem[]
}

export interface ApiResponse<T> {
  status: number;    // HTTP 상태 코드 (200, 400, 500 등)
  success: boolean;  // 성공 여부
  message: string;   // 응답 메시지
  data: T;           // 제네릭 타입의 데이터
}

export const InitUser: User = { id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: -1, contestId: -1, createdAt: '' };
export const InitExample: Example = { id: -1, problemId: -1, exampleInput: "", exampleOutput: "", createdAt: new Date().toISOString() };