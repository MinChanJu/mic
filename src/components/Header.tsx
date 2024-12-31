import React from "react";
import { useNavigate } from 'react-router-dom';
import { Contest, CurrentContest, Problem, User } from "../model/talbe";
import logo from "../image/MiC_logo.png"
import './css/Header.css';

interface HeaderProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  problems: Problem[]
  contests: Contest[]
  setCurrentContest: React.Dispatch<React.SetStateAction<CurrentContest>>;
}

const Header:React.FC<HeaderProps> = ({user,setUser,problems,contests,setCurrentContest}) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate('/login');
  };

  const goToProblem = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate('/problem');
  };

  const goToContest = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate('/contest');
  };

  const goToUserId = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate(`/user/${user.userId}`);
  };

  const goToHome = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate('/home');
    window.location.reload();
  };

  const goToSetting = () => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate('/setting');
  };

  const goToProblemId = (problemId:number) => {
    setCurrentContest({contestId:-1, contestName: ''})
    navigate(`/problem/${problemId}`);
  };

  const goToContestId = (contestId:number, contestName:string) => {
    setCurrentContest({contestId: contestId, contestName: contestName})
    navigate(`/contest/${contestId}`);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser({id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: 0, createdAt: ''});
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
          {user.name !== "" && <span style={{marginLeft: '10px', marginRight: '10px', fontSize: '20px'}}>|</span>}
          {user.name !== "" && <span onClick={goToSetting}>설정</span>}
          {user.name !== "" && <span style={{marginLeft: '10px', marginRight: '10px', fontSize: '20px'}}>|</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
        </div>
        <div className="menu">
          <div className="select-menu" onClick={goToProblem}>문제</div>
          <div className="select-menu" onClick={goToContest}>대회</div>
          <div className="description">
            <div className="select-menu-description">
              <h2>문제</h2>
              {problems.slice(-5).map((problem) => (
                <div key={problem.id} onClick={() => {goToProblemId(problem.id)}}>{String(problem.id).padStart(3, '0')}. {problem.problemName}</div>
              ))}
            </div>
            <div className="select-menu-description">
              <h2>대회</h2>
              {contests.slice(0, 5).map((contest) => (
                <div key={contest.id} onClick={() => {goToContestId(contest.id, contest.contestName)}}>{contest.contestName}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header