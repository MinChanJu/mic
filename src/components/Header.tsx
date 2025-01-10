import React from "react";
import { useNavigate } from 'react-router-dom';
import { Contest, CurrentContest, Problem, Solved, User, InitUser, InitCurrentContest } from "../model/talbe";
import logo from "../assets/MiC_logo.png"
import './css/Header.css';

interface HeaderProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setSolveds: React.Dispatch<React.SetStateAction<Solved[]>>;
  problems: Problem[]
  contests: Contest[]
  setCurrentContest: React.Dispatch<React.SetStateAction<CurrentContest>>;
}

const Header: React.FC<HeaderProps> = ({ user, setUser, setSolveds, problems, contests, setCurrentContest }) => {
  const finishContests = contests.filter((contest) => new Date(contest.eventTime) < new Date())
  const navigate = useNavigate();

  const goToLogin = () => {
    setCurrentContest(InitCurrentContest)
    navigate('/login');
  };

  const goToProblem = () => {
    setCurrentContest(InitCurrentContest)
    navigate('/problem');
  };

  const goToContest = () => {
    setCurrentContest(InitCurrentContest)
    navigate('/contest');
  };

  const goToUserId = () => {
    setCurrentContest(InitCurrentContest)
    navigate(`/user/${user.userId}`);
  };

  const goToHome = () => {
    setCurrentContest(InitCurrentContest)
    navigate('/home');
    window.location.reload();
  };

  const goToSetting = () => {
    setCurrentContest(InitCurrentContest)
    navigate('/setting');
  };

  const goToProblemId = (problemId: number) => {
    setCurrentContest(InitCurrentContest)
    navigate(`/problem/${problemId}`);
  };

  const goToContestId = (contestId: number, contestName: string) => {
    setCurrentContest({ contestId: contestId, contestName: contestName })
    navigate(`/contest/${contestId}`);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(InitUser);
    setSolveds([]);
    navigate('/home');
    window.location.reload();
  }

  return (
    <header>
      <div className="logo" onClick={goToHome}>
        <img className="logoImg" src={logo} alt="" />
        <span className="logoTitle">
          <div>Mathematics</div>
          <div>in Coding</div>
        </span>
      </div>
      <div className="menu-container">
        <div className="login">
          {user.name !== "" && <span onClick={goToUserId}>{user.name}</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name !== "" && <span onClick={goToSetting}>설정</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
        </div>
        <div className="menu">
          {user.contest == -1 && <div className="select-menu" onClick={goToProblem}>문제</div>}
          <div className="select-menu" onClick={goToContest}>대회</div>
          <div className="description">
            {user.contest == -1 && <div className="select-menu-description">
              <h2>문제</h2>
              {problems.slice(-5).map((problem) => (
                <div key={problem.id} onClick={() => { goToProblemId(problem.id) }}>{String(problem.id).padStart(3, '0')}. {problem.problemName}</div>
              ))}
            </div>}
            <div className="select-menu-description">
              <h2>대회</h2>
              {finishContests.slice(0, 5).map((contest) => (
                <div key={contest.id} onClick={() => { goToContestId(contest.id, contest.contestName) }}>{contest.contestName}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header