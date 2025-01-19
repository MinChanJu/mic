import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const useNavigation = () => {
  const navigate = useNavigate();

  return {
    goToPage: (path: string) => navigate(path),
    goToHome: () => navigate(ROUTES.HOME),
    goToLogin: () => navigate(ROUTES.LOGIN),
	goToUserId: (userId: string) => navigate(ROUTES.USER(userId)),
	goToSetting: () => navigate(ROUTES.SETTING),
    goBack: () => navigate(-1),

	// 대회 이동
	goToContest: () => navigate(ROUTES.CONTEST),
	goToContestMake: () => navigate(ROUTES.CONTEST_MAKE),
	goToContestEdit: (contestId: number) => navigate(ROUTES.CONTEST_EDIT(contestId)),
	goToContestId: (contestId: number) => navigate(ROUTES.CONTEST_ID(contestId)),
	goToContestScoreBoard: (contestId: number) => navigate(ROUTES.CONTEST_SCORE_BOARD(contestId)),

	// 문제 이동
	goToProblem: () => navigate(ROUTES.PROBLEM),
	goToProblemMake: (contestId: number) => navigate(ROUTES.PROBLEM_MAKE(contestId)),
	goToProblemEdit: (problemId: number) => navigate(ROUTES.PROBLEM_EDIT(problemId)),
	goToProblemId: (problemId: number) => navigate(ROUTES.PROBLEM_ID(problemId)),
  };
};

export default useNavigation;