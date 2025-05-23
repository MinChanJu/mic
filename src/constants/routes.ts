export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USER: (userId: string) => `/user/${userId}`,
  SETTING: '/setting',
  REPORT: '/report',
  NOTICE: '/notice',
  NOTICE_ID: (noticeId: number) => `/notice/${noticeId}`,

  CONTEST: '/contest',
  CONTEST_MAKE: '/contest/make',
  CONTEST_EDIT: (contestId: number) => `/contest/edit/${contestId}`,
  CONTEST_MANAGE: (contestId: number) => `/contest/manage/${contestId}`,
  CONTEST_ID: (contestId: number) => `/contest/${contestId}`,
  CONTEST_SCORE_BOARD: (contestId: number) => `/score/${contestId}`,

  PROBLEM: '/problem',
  PROBLEM_MAKE: (contestId: number) => `/problem/make/${contestId}`,
  PROBLEM_EDIT: (problemId: number) => `/problem/edit/${problemId}`,
  PROBLEM_ID: (problemId: number) => `/problem/${problemId}`,

  NOT_FOUND: '*',
};