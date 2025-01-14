import React, { useEffect, useRef, useState } from "react"
import { URL, Contest, Problem, Solve, User, mathJaxConfig, ApiResponse } from "../model/talbe"
import axios, { AxiosError } from "axios"
import './css/SettingView.css'
import CommonFunction from "../model/CommonFunction"
import { MathJax, MathJaxContext } from "better-react-mathjax"

interface SettingViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
  solves: Solve[]
}

const SettingView: React.FC<SettingViewProps> = ({ user, contests, problems, solves }) => {

  const [data, setData] = useState<string>("정보")
  return (
    <div className="setting-container">
      <div className="setting-menu">
        <div className={data === "정보" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("정보") }}>정보</div>
        <div className={data === "비밀번호 변경" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("비밀번호 변경") }}>비밀번호 변경</div>
        <div className={data === "내가 푼 문제" ? "setting-menu-select last now" : "setting-menu-select last"} onClick={() => { setData("내가 푼 문제") }}>내가 푼 문제</div>

        {user.authority == 5 && <>
          <div className="admin-menu">관리자 메뉴</div>
          <div className={data === "만든 문제" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("만든 문제") }}>만든 문제</div>
          <div className={data === "만든 대회" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("만든 대회") }}>만든 대회</div>
          <div className={data === "회원 관리" ? "setting-menu-select last now" : "setting-menu-select last"} onClick={() => { setData("회원 관리") }}>회원 관리</div>
        </>}
      </div>
      <div className="setting-view">
        <div className="view-title">{data}</div>
        {data === "정보" && <Info user={user} />}
        {data === "비밀번호 변경" && <ChagePw user={user} />}
        {data === "내가 푼 문제" && <SolvePage problems={problems} solves={solves} />}
        {data === "만든 문제" && <MakePro user={user} problems={problems} />}
        {data === "만든 대회" && <MakeCon user={user} contests={contests} />}
        {data === "회원 관리" && <UserManage user={user} contests={contests} />}
      </div>
    </div>
  )
}

export default SettingView

interface UserProps {
  user: User
}

const Info: React.FC<UserProps> = ({ user }) => {
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
      <div className="total-container">
        <div className="view-container">
          <div className="view-name">이름: </div>
          <div className="view-content">{user.name}</div>
        </div>
        <div className="view-container">
          <div className="view-name">아이디: </div>
          <div className="view-content">{user.userId}</div>
        </div>
        <div className="view-container">
          <div className="view-name">전화번호: </div>
          <input className="view-content" ref={phoneRef} type="text"></input>
        </div>
        <div className="view-container">
          <div className="view-name">이메일: </div>
          <input className="view-content" ref={emailRef} type="text"></input>
        </div>
        <div className="view-container">
          <div className="view-name">비밀번호: </div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div className="view-submit" onClick={handleSubmit}>변경</div>
      </div>
    </div>
  )
}

const ChagePw: React.FC<UserProps> = ({ user }) => {
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
      <div className="total-container">
        <div>
          <div className="view-name">현재 비밀번호</div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div>
          <div className="view-name">새로운 비밀번호</div>
          <input className="view-content" ref={newPasswordRef} type="password"></input>
        </div>
        <div>
          <div className="view-name">새로운 비밀번호 확인</div>
          <input className="view-content" ref={newcheckPasswordRef} type="password"></input>
        </div>
        <div className="view-submit" onClick={handleSubmit}>변경</div>
      </div>
    </div>
  )
}

interface solvdeProps {
  problems: Problem[]
  solves: Solve[]
}

const SolvePage: React.FC<solvdeProps> = ({ problems, solves }) => {
  const { goToProblemId } = CommonFunction()
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px", textAlign: "center" }}>번호</th>
            <th>문제 제목</th>
            <th style={{ width: "30px", textAlign: "center" }}>해결</th>
          </tr>
        </thead>
        <tbody>
          {solves.map((solve) => (
            <tr key={solve.id} onClick={() => { goToProblemId(solve.problemId) }}>
              <td>{solve.problemId}</td>
              <td>
                {(() => {
                  const problem = problems.find((problem) => problem.id == solve.problemId)
                  if (!problem) return <></>
                  return <>{problem.problemName}</>
                })()}
              </td>
              <td>
                {(() => {
                  const score = solve.score;
                  let style = { backgroundColor: "rgb(238, 255, 0)" };
                  if (score === 1000) style.backgroundColor = "rgb(43, 255, 0)";
                  if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

                  return <div className="solve" style={style}>{score/10}</div>;
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ProblemProps {
  user: User,
  problems: Problem[]
}

const MakePro: React.FC<ProblemProps> = ({ user, problems }) => {
  const { goToProblemId } = CommonFunction()
  const myProblems = problems.filter(problem => problem.userId === user.userId);

  return (
    <div className="total-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px", textAlign: "center" }}>번호</th>
            <th>문제 이름</th>
            <th>주최자</th>
          </tr>
        </thead>
        <tbody>
          <MathJaxContext config={mathJaxConfig}>
            {myProblems.map((problem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ cursor: "pointer" }} onClick={() => { goToProblemId(problem.id) }}>
                  <MathJax>{problem.problemName}</MathJax>
                </td>
                <td>{problem.userId}</td>
              </tr>
            ))}
          </MathJaxContext>
        </tbody>
      </table>
    </div>
  )
}

interface ContestProps {
  user: User,
  contests: Contest[]
}

const MakeCon: React.FC<ContestProps> = ({ user, contests }) => {
  const { goToContestId } = CommonFunction()
  const myContests = contests.filter(contest => contest.userId === user.userId);

  return (
    <div className="total-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px", textAlign: "center" }}>번호</th>
            <th>대회 이름</th>
            <th>주최자</th>
          </tr>
        </thead>
        <tbody>
          {myContests.map((contest, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td style={{ cursor: "pointer" }} onClick={() => { goToContestId(user, contest, false) }}>{contest.contestName}</td>
              <td>{contest.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const UserManage: React.FC<ContestProps> = ({ user, contests }) => {
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
    let updateUser = user;
    updateUser.authority = authoritys[index]
    updateUser.contestId = enters[index]
    try {
      await axios.put(URL + `users/update`, updateUser, { timeout: 10000 });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) console.error(error.response.data.message);
        else console.error("서버 에러: ", error)
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user.authority === 5) {
        try {
          const response = await axios.post<ApiResponse<User[]>>(URL + 'users', null, { timeout: 10000 });
          const UsersR: User[] = response.data.data;

          setUsers(UsersR);
          setAuthoritys(UsersR.map((user) => user.authority));
          setEnters(UsersR.map((user) => user.contestId));
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) console.error(error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
        }
      }
    }
    fetchData()
  }, []);

  return (
    <div className="total-container">
      {user.authority !== 5 && <div>권한이 없음</div>}
      <table>
        <thead>
          <tr>
            <th style={{ width: "30px", textAlign: "center" }}>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>권한</th>
            <th>대회여부</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.email}</td>
              <td><input type="number" value={authoritys[index]} onChange={(event) => handleChangeAuthority(index, event)} min="0" max="5" step="1"></input></td>
              <td><input type="number" value={enters[index]} onChange={(event) => handleChangeEnter(index, event)} min="-1" max={contests.reduce((max, item) => (item.id > max ? item.id : max), 0).toString()} step="1"></input></td>
              <td><button onClick={() => handleChange(user, index)}>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}