import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Contest, InitUser, Solved, URL, User } from "./talbe";

const CommonFunction = () => {
    const navigate = useNavigate();

    // 공통 이동
    const goToPage = (path: string) => navigate(path);

    // 기본 이동
    const goToHome = () => navigate('/home');

    const goToLogin = () => navigate('/login');
    const goToUserId = (userId: string) => navigate(`/user/${userId}`);
    const goToSetting = () => navigate('/setting');

    // 대회 이동
    const goToContest = () => navigate('/contest');
    const goToContestId = (user: User, contest: Contest, pop: boolean) => {
        if (!pop || user.userId === contest.userId || user.authority === 5) {
            navigate(`/contest/${contest.id}`);
        } else {
            alert("아직 대회 시간이 안되었습니다.");
        }
    };
    const goToMakeContest = () => navigate(`/contest/make`);
    const goToContestEdit = (contestId: number) => navigate(`/contest/edit/${contestId}`);
    const goToScoreBoard = (contestId: number) => navigate(`/score/${contestId}`);

    // 문제 이동
    const goToProblem = () => navigate('/problem');
    const goToProblemId = (problemId: number) => navigate(`/problem/${problemId}`);
    const goToMakeProblem = (contestId: number) => navigate(`/problem/make/${contestId}`);
    const goToProblemEdit = (problemId: number) => navigate(`/problem/edit/${problemId}`);

    // 삭제
    const deleteContest = async (contestId: number) => {
        try {
            await axios.delete<void>(URL + `contests/${contestId}`, { timeout: 10000 });
            goToContest();
            window.location.reload();
        } catch (error) {
            console.error("서버 오류", error);
        }
    };

    const deleteProblem = async (id: number) => {
        try {
            await axios.delete<void>(URL + `problems/${id}`, { timeout: 10000 });
            goToHome();
            window.location.reload();
        } catch (error) {
            console.error("서버 오류", error);
        }
    };

    // 로그아웃
    const logout = (
        setUser: React.Dispatch<React.SetStateAction<User>>,
        setSolveds: React.Dispatch<React.SetStateAction<Solved[]>>
    ) => {
        sessionStorage.removeItem('user');
        setUser(InitUser);
        setSolveds([]);
        goToHome();
        window.location.reload();
    };

    const TimeFormat = (eventTime: string, time: number) => {
        const event = new Date(eventTime);
        event.setMinutes(event.getMinutes() + time);
        const year = event.getFullYear();
        const month = String(event.getMonth() + 1).padStart(2, "0");
        const day = String(event.getDate()).padStart(2, "0");
        const hours = String(event.getHours()).padStart(2, "0");
        const minutes = String(event.getMinutes()).padStart(2, "0");
        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    }
    
    const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };
    

    return {
        goToPage,
        goToHome,
        goToLogin,
        goToUserId,
        goToSetting,
        goToContest,
        goToContestId,
        goToMakeContest,
        goToContestEdit,
        goToScoreBoard,
        goToProblem,
        goToProblemId,
        goToMakeProblem,
        goToProblemEdit,
        deleteContest,
        deleteProblem,
        logout,
        TimeFormat,
        autoResize
    };
};

export default CommonFunction;