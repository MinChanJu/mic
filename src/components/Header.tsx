import React, { useEffect, useState } from "react"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { AxiosError } from "axios"
import { getAllFilterContestsAndProblems } from "../api/myData"
import { mathJaxConfig } from "../constants/mathJaxConfig"
import { useUser } from "../context/UserContext"
import { Contest } from "../types/entity/Contest"
import logo from "../assets/images/logo.png"
import useNavigation from "../hooks/useNavigation"
import styles from "../assets/css/Header.module.css"
import { ProblemListDTO } from "../types/dto/ProblemListDTO"

const Header: React.FC = () => {
  const { user, logout } = useUser()
  const { goToContest, goToContestId, goToHome, goToLogin, goToProblem, goToProblemId, goToSetting, goToUserId } = useNavigation()
  const [contests, setContests] = useState<Contest[]>([])
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])

  useEffect(() => {
    async function loadContestsAndProblems() {
      try {
        const response = await getAllFilterContestsAndProblems();
        setContests(response.data.contests);
        setProblemList(response.data.problems);
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
      <div className={styles.logo} onClick={() => { goToHome(); window.location.reload(); }}>
        <img style={{width: "100px"}} src={logo} alt="" />
        <span className={styles.logoTitle}>
          <div>Mathematics</div>
          <div>in Coding</div>
        </span>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.login}>
          {user.name !== "" && <span onClick={() => { goToUserId(user.userId) }}>{user.name}</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name !== "" && <span onClick={goToSetting}>설정</span>}
          {user.name !== "" && <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '20px' }}>|</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
        </div>
        <div className={styles.menu}>
          {user.contestId == -1 && <div className={styles.selectMenu} onClick={goToProblem}>문제</div>}
          <div className={styles.selectMenu} onClick={goToContest}>대회</div>
          <div className={styles.description}>
            {user.contestId == -1 && <div className={styles.selectMenuDescription}>
              <h2>문제</h2>
              <MathJaxContext config={mathJaxConfig}>
                {problemList.slice(-5).map((problem) => (
                  <div key={problem.id} onClick={() => { goToProblemId(problem.problemId!) }}>
                    <MathJax>
                      {String(problem.problemId).padStart(3, '0')}. {problem.problemName}
                    </MathJax>
                  </div>
                ))}
              </MathJaxContext>
            </div>}
            <div className={styles.selectMenuDescription}>
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