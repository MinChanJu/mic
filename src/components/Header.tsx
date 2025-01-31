import React, { useEffect, useState } from "react"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { getAllFilterContestsAndProblems } from "../api/myData"
import { mathJaxConfig } from "../constants/mathJaxConfig"
import { useUser } from "../context/UserContext"
import { ContestListDTO } from "../types/dto/ContestListDTO"
import { ProblemListDTO } from "../types/dto/ProblemListDTO"
import { NoticeListDTO } from "../types/dto/NoticeListDTO"
import { ContestsAndProblemsDTO } from "../types/dto/ContestsAndProblemsDTO"
import { resultInterval } from "../utils/resultInterval"
import logo from "../assets/images/logo.png"
import styles from "../assets/css/Header.module.css"
import useNavigation from "../hooks/useNavigation"
import ErrorPage from "./ErrorPage"
import Loading from "./Loading"


const Header: React.FC = () => {
  const { user, logout } = useUser()
  const { goToContest, goToContestId, goToHome, goToLogin, goToProblem, goToProblemId, goToSetting, goToUserId, goToNotice, goToNoticeId } = useNavigation()
  const [contestList, setContestList] = useState<ContestListDTO[]>([])
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])
  const [noticeList, setNoticeList] = useState<NoticeListDTO[]>([])
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function loadContestsAndProblems() {
      try {
        const requestId = await getAllFilterContestsAndProblems();
        const response = await resultInterval<ContestsAndProblemsDTO>('data', requestId.data, setError, setLoad);
        setContestList(response.contests)
        setProblemList(response.problems)
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }
    }

    loadContestsAndProblems();

    setNoticeList([])
  }, []);

  const Menu: React.FC = () => {
    return (
      <>
        {user.contestId == -1 &&
          <div className={styles.selectMenuDescription}>
            <h2>문제</h2>
            <MathJaxContext config={mathJaxConfig}>
              {problemList.slice(-5).map((problem) => (
                <div key={problem.id} onClick={() => { goToProblemId(problem.problemId) }}>
                  <MathJax>
                    {String(problem.problemId).padStart(3, '0')}. {problem.problemName}
                  </MathJax>
                </div>
              ))}
            </MathJaxContext>
          </div>
        }
        <div className={styles.selectMenuDescription}>
          <h2>대회</h2>
          <MathJaxContext config={mathJaxConfig}>
            {contestList.slice(0, 5).map((contest) => (
              <div key={contest.id} onClick={() => { goToContestId(contest.contestId) }}>
                <MathJax>
                  {contest.contestName}
                </MathJax>
              </div>
            ))}
          </MathJaxContext>
        </div>
        {user.contestId == -1 &&
          <div className={styles.selectMenuDescription}>
            <h2>게시판</h2>
            <MathJaxContext config={mathJaxConfig}>
              {noticeList.slice(-5).map((notice) => (
                <div key={notice.id} onClick={() => { goToNoticeId(notice.noticeid) }}>
                  <MathJax>
                    {notice.title}
                  </MathJax>
                </div>
              ))}
            </MathJaxContext>
          </div>
        }
      </>
    )
  }



  return (
    <header>
      <div className={styles.logo} onClick={() => { goToHome(); window.location.reload(); }}>
        <img style={{ width: "100px" }} src={logo} alt="" />
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
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
        </div>
        <div className={styles.menu}>
          {user.contestId == -1 && <div className={styles.selectMenu} onClick={goToProblem}>문제</div>}
          <div className={styles.selectMenu} onClick={goToContest}>대회</div>
          <div className={styles.selectMenu} onClick={goToNotice}>게시판</div>
          <div className={styles.description}>
            {error && <ErrorPage message="" subMessage="서버 에러" marginTop={50} marginBottom={50} />}
            {!error && !load && <Loading width={30} marginTop={50} marginBottom={50} />}
            {!error && load && <Menu />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header