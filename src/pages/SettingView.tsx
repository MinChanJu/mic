import React, { useEffect, useRef, useState } from "react"
import { MathJaxContext } from "better-react-mathjax"
import { AxiosError } from "axios"
import { getAllProblemsByUserId, getAllSolveProblemsByUserId } from "../api/problem"
import { getContestListForUserId } from "../api/contest"
import { getAllUsers, updateUser } from "../api/user"
import { mathJaxConfig } from "../constants/mathJaxConfig"
import { useUser } from "../context/UserContext"
import { FormatFunctions, ScoreFormat } from "../utils/formatter"
import { ProblemScoreDTO } from "../types/dto/ProblemScoreDTO"
import { Contest } from "../types/entity/Contest"
import { Problem } from "../types/entity/Problem"
import { User } from "../types/entity/User"
import useNavigation from "../hooks/useNavigation"
import styles from "../assets/css/SettingView.module.css"
import Table from "../components/Table"
import { resultInterval } from "../utils/resultInterval"


const SettingView: React.FC = () => {
  const { user } = useUser()

  const [data, setData] = useState<string>("정보")
  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingMenu}>
        <div className={data === "정보" ? styles.settingMenuSelect + " " + styles.now : styles.settingMenuSelect} onClick={() => { setData("정보") }}>정보</div>
        <div className={data === "비밀번호 변경" ? styles.settingMenuSelect + " " + styles.now : styles.settingMenuSelect} onClick={() => { setData("비밀번호 변경") }}>비밀번호 변경</div>
        <div className={data === "내가 푼 문제" ? styles.settingMenuSelect + " " + styles.last + " " + styles.now : styles.settingMenuSelect + " " + styles.last} onClick={() => { setData("내가 푼 문제") }}>내가 푼 문제</div>

        {user.authority == 5 && <>
          <div className={styles.adminMenu}>관리자 메뉴</div>
          <div className={data === "만든 문제" ? styles.settingMenuSelect + " " + styles.now : styles.settingMenuSelect} onClick={() => { setData("만든 문제") }}>만든 문제</div>
          <div className={data === "만든 대회" ? styles.settingMenuSelect + " " + styles.now : styles.settingMenuSelect} onClick={() => { setData("만든 대회") }}>만든 대회</div>
          <div className={data === "회원 관리" ? styles.settingMenuSelect + " " + styles.last + " " + styles.now : styles.settingMenuSelect + " " + styles.last} onClick={() => { setData("회원 관리") }}>회원 관리</div>
        </>}
      </div>
      <div className={styles.settingView}>
        <div className={styles.viewTitle}>{data}</div>
        {data === "정보" && <Info />}
        {data === "비밀번호 변경" && <ChagePw />}
        {data === "내가 푼 문제" && <SolvePage />}
        {data === "만든 문제" && <MakePro />}
        {data === "만든 대회" && <MakeCon />}
        {data === "회원 관리" && <UserManage />}
      </div>
    </div>
  )
}

export default SettingView

const Info: React.FC = () => {
  const { user } = useUser()
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (phoneRef.current &&
      emailRef.current) {
      phoneRef.current.value = user.phone
      emailRef.current.value = user.email
    }
  }, [])

  const handleSubmit = () => {
    if (phoneRef.current &&
      emailRef.current &&
      passwordRef.current) {
      console.log("변경 전화번호 : " + phoneRef.current.value)
      console.log("변경 이메일 : " + emailRef.current.value)
      console.log("현재 비밀번호 : " + passwordRef.current.value)
      if (passwordRef.current.value === user.userPw) {
        console.log("가능")
      } else {
        console.log("불가능")
      }
    }
  }

  return (
    <div>
      <div className="flexCol gap20">
        <div className="flexRow">
          <div className={styles.viewName}>이름: </div>
          <div className={styles.viewContent}>{user.name}</div>
        </div>
        <div className="flexRow">
          <div className={styles.viewName}>아이디: </div>
          <div className={styles.viewContent}>{user.userId}</div>
        </div>
        <div className="flexRow">
          <div className={styles.viewName}>전화번호: </div>
          <input className={styles.viewContent} ref={phoneRef} type="text"></input>
        </div>
        <div className="flexRow">
          <div className={styles.viewName}>이메일: </div>
          <input className={styles.viewContent} ref={emailRef} type="text"></input>
        </div>
        <div className="flexRow">
          <div className={styles.viewName}>비밀번호: </div>
          <input className={styles.viewContent} ref={passwordRef} type="password"></input>
        </div>
        <div className={styles.viewSubmit} onClick={handleSubmit}>변경</div>
      </div>
    </div>
  )
}

const ChagePw: React.FC = () => {
  const { user } = useUser()
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const newPasswordRef = useRef<HTMLInputElement | null>(null)
  const newcheckPasswordRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = () => {
    if (passwordRef.current &&
      newPasswordRef.current &&
      newcheckPasswordRef.current) {
      console.log("현재 비밀번호 : " + passwordRef.current.value)
      console.log("변경 비밀번호 : " + newPasswordRef.current.value)
      console.log("변경 비밀번호 확인 : " + newcheckPasswordRef.current.value)
      if (passwordRef.current.value === user.userPw) {
        if (newPasswordRef.current.value === newcheckPasswordRef.current.value) {
          console.log("가능")
        } else {
          console.log("새로운 비밀번호 불일치")
        }
      } else {
        console.log("현재 비밀번호 불일치")
      }
    }
  }

  return (
    <div>
      <div className="flexCol gap20">
        <div>
          <div className={styles.viewName}>현재 비밀번호</div>
          <input className={styles.viewContent} ref={passwordRef} type="password"></input>
        </div>
        <div>
          <div className={styles.viewName}>새로운 비밀번호</div>
          <input className={styles.viewContent} ref={newPasswordRef} type="password"></input>
        </div>
        <div>
          <div className={styles.viewName}>새로운 비밀번호 확인</div>
          <input className={styles.viewContent} ref={newcheckPasswordRef} type="password"></input>
        </div>
        <div className={styles.viewSubmit} onClick={handleSubmit}>변경</div>
      </div>
    </div>
  )
}

const SolvePage: React.FC = () => {
  const { user } = useUser()
  const [problemScores, setProblemScores] = useState<ProblemScoreDTO[]>([])
  const { goToProblemId } = useNavigation()

  useEffect(() => {
    async function loadProblemScores() {
      let requestId = ''
      try {
        const response = await getAllSolveProblemsByUserId(user.userId);
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
      }

      resultInterval("problems", requestId, undefined, undefined, setProblemScores);
    }
    loadProblemScores();
  }, []);

  const format = {
    problem: (value: Problem, row: number, col: number) => {
      if (col == 0) return <>{row+1}</>
      return <>{value.problemName}</>
    },
    score: (value: number) => ScoreFormat(value),
  }
  return (
    <MathJaxContext config={mathJaxConfig}>
      <Table
        columnName={["번호", "문제 제목", "해결"]}
        columnClass={["num", "", "solveHead"]}
        data={problemScores}
        dataName={["problem", "problem", "score"]}
        dataFunc={format}
        onClick={(item) => { goToProblemId(item.problem.id!) }} />
    </MathJaxContext>
  )
}

const MakePro: React.FC = () => {
  const { user } = useUser()
  const { goToProblemId } = useNavigation()
  const [problems, setProblems] = useState<Problem[]>([])
  const myProblems = problems.filter(problem => problem.userId === user.userId);

  useEffect(() => {
    async function fetchData() {
      let requestId = ''
      try {
        const response = await getAllProblemsByUserId(user.userId);
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
      }

      resultInterval("problems", requestId, undefined, undefined, setProblems);
    }
    fetchData()
  }, [])

  return (
    <MathJaxContext config={mathJaxConfig}>
      <Table
        columnName={["번호", "문제 제목"]}
        columnClass={["num", ""]}
        data={myProblems}
        dataName={["id", "problemName"]}
        dataFunc={FormatFunctions}
        onClick={(item) => { goToProblemId(item.id!) }} />
    </MathJaxContext>
  )
}

const MakeCon: React.FC = () => {
  const { user } = useUser()
  const { goToContestId } = useNavigation()
  const [contests, setContests] = useState<Contest[]>([])
  const myContests = contests.filter(contest => contest.userId === user.userId);

  useEffect(() => {
    async function fetchData() {
      let requestId = ''
      try {
        const response = await getContestListForUserId();
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
      }

      resultInterval("contests", requestId, undefined, undefined, setContests);
    }
    fetchData()
  }, [])

  return (
    <MathJaxContext config={mathJaxConfig}>
      <Table
        columnName={["번호", "대회 이름"]}
        columnClass={["num", ""]}
        data={myContests}
        dataName={["id", "contestName"]}
        dataFunc={FormatFunctions}
        onClick={(item) => { goToContestId(item.id!) }} />
    </MathJaxContext>
  )
}

const UserManage: React.FC = () => {
  const { user } = useUser()
  const [users, setUsers] = useState<User[]>([]);
  const [authoritys, setAuthoritys] = useState<number[]>([]);
  const [enters, setEnters] = useState<number[]>([]);

  const handleChangeAuthority = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAuthoritys = [...authoritys];
    updatedAuthoritys[index] = parseInt(event.target.value, 10);
    setAuthoritys(updatedAuthoritys);
  };

  const handleChangeEnter = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEnters = [...enters];
    updatedEnters[index] = parseInt(event.target.value, 10);
    setEnters(updatedEnters);
  };

  const handleChange = async (user: User, index: number) => {
    let userDetail = user;
    userDetail.authority = authoritys[index]
    userDetail.contestId = enters[index] === -1 ? -1 : enters[index]
    try {
      await updateUser(userDetail);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) console.error("응답 에러: ", error.response.data.message);
        else console.error("서버 에러: ", error)
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user.authority === 5) {
        let requestId = ''
        try {
          const response = await getAllUsers();
          requestId = response.data;
        } catch (error) {
          console.error("에러: ", error);
        }

        try {
          const response = await resultInterval<User[]>("users", requestId);
          setUsers(response);
          setAuthoritys(response.map((user) => user.authority));
          setEnters(response.map((user) => {
            if (user.contestId) return user.contestId
            return -1;
          }));
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) console.error("응답 에러: ", error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
        }
      }
    }
    fetchData()
  }, []);

  const formatUserManage = {
    id: (_: number | null, idx: number) => <>{idx+1}</>,
    authority: (_: number, idx: number) => <input type="number" value={authoritys[idx]} onChange={(event) => handleChangeAuthority(idx, event)} min="0" max="5" step="1" />,
    contestId: (_: number | null, idx: number) => <input type="number" value={enters[idx]} onChange={(event) => handleChangeEnter(idx, event)} min="-1" max="100" step="1" />,
    createdAt: (_: string, idx:number) => <button onClick={() => handleChange(users[idx], idx)}>수정</button>
  }

  return (
    <div className="total-container">
      {user.authority !== 5 && <div>권한이 없음</div>}
      <MathJaxContext config={mathJaxConfig}>
      <Table
        columnName={["번호", "이름", "아이디", "이메일", "권한", "대회", "수정"]}
        columnClass={["num", "", "", "", "numIn", "numIn", "edit"]}
        data={users}
        dataName={["id", "name", "userId", "email", "authority", "contestId", "createdAt"]}
        dataFunc={formatUserManage} />
    </MathJaxContext>
    </div>
  )
}