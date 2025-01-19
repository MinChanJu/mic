import React, { useEffect, useState } from "react"
import logo from "../assets/MiC_logo.png"
import '../styles/Header.css'
import { useUser } from "../context/UserContext"
import { Contest } from "../types/Contest"
import { Problem } from "../types/Problem"
import useNavigation from "../hooks/useNavigation"
import { getAllFilterContestsAndProblems } from "../api/myData"
import { AxiosError } from "axios"

const Header: React.FC = () => {
  const { user, logout } = useUser()
  const { goToContest, goToContestId, goToHome, goToLogin, goToProblem, goToProblemId, goToSetting, goToUserId } = useNavigation()
  const [contests, setContests] = useState<Contest[]>([])
  const [problems, setProblems] = useState<Problem[]>([])

  useEffect(() => {
    async function loadContestsAndProblems() {
      try {
        const response = await getAllFilterContestsAndProblems();
        setContests(response.data.contests);
        setProblems(response.data.problems);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error(error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    loadContestsAndProblems();
  }, []);

  return (
    <header>
      <div className="logo" onClick={() => { goToHome(); window.location.reload(); }}>
        <img className="logoImg" src={logo} alt="" />
        <span className="logoTitle">
          <div>Mathematics</div>
          <div>in Coding</div>
        </span>
      </div>
      <div className="menu-container">
        <div className="login">
          {user.name !== "" && <span onClick={() => { goToUserId(user.userId) }}>{user.name}</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name !== "" && <span onClick={goToSetting}>설정</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
        </div>
        <div className="menu">
          {user.contestId == null && <div className="select-menu" onClick={goToProblem}>문제</div>}
          <div className="select-menu" onClick={goToContest}>대회</div>
          <div className="description">
            {user.contestId == null && <div className="select-menu-description">
              <h2>문제</h2>
              {problems.slice(-5).map((problem) => (
                <div key={problem.id} onClick={() => { goToProblemId(problem.id!) }}>{String(problem.id).padStart(3, '0')}. {problem.problemName}</div>
              ))}
            </div>}
            <div className="select-menu-description">
              <h2>대회</h2>
              {contests.slice(0, 5).map((contest) => (
                <div key={contest.id} onClick={() => { goToContestId(contest.id!) }}>{contest.contestName}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header