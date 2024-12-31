import React, { useCallback, useEffect, useRef, useState } from "react";
import { Contest, Problem, User } from "../model/talbe";
import { severArrayRetry } from "../model/serverRetry";
import './css/SettingView.css'
import { useNavigate } from "react-router-dom";

interface SettingViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
}

const SettingView: React.FC<SettingViewProps> = ({ user, contests, problems }) => {
  const [data, setData] = useState<string>("정보")
  return (
    <div className="setting-container">
      <div className="setting-menu">
        <div className={data === "정보" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("정보") }}>정보</div>
        <div className={data === "비밀번호 변경" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("비밀번호 변경") }}>비밀번호 변경</div>
        <div className={data === "내가 푼 문제" ? "setting-menu-select last now" : "setting-menu-select last"} onClick={() => { setData("내가 푼 문제") }}>내가 푼 문제</div>

        <div className="admin-menu">관리자 메뉴</div>
        <div className={data === "만든 문제" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("만든 문제") }}>만든 문제</div>
        <div className={data === "만든 대회" ? "setting-menu-select now" : "setting-menu-select"} onClick={() => { setData("만든 대회") }}>만든 대회</div>
        <div className={data === "회원 관리" ? "setting-menu-select last now" : "setting-menu-select last"} onClick={() => { setData("회원 관리") }}>회원 관리</div>
      </div>
      <div className="setting-view">
        <div className="view-title">{data}</div>
        {data === "정보" && <Info user={user} />}
        {data === "비밀번호 변경" && <ChagePw user={user} />}
        {data === "내가 푼 문제" && <Solved user={user} />}
        {data === "만든 문제" && <MakePro user={user} problems={problems} />}
        {data === "만든 대회" && <MakeCon user={user} contests={contests} />}
        {data === "회원 관리" && <UserManage user={user} />}
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
  })

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

const Solved: React.FC<UserProps> = ({ user }) => {
  return (
    <div>내가 푼 문제</div>
  )
}

interface ProblemProps {
  user: User,
  problems: Problem[]
}

const MakePro: React.FC<ProblemProps> = ({ user, problems }) => {
  const myProblems = problems.filter(problem => problem.userId === user.userId);
  const navigate = useNavigate();

  const goToProblem = (id:number) => {
    navigate(`/problem/${id}`)
  }

  return (
    <div className="total-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>대회 이름</th>
            <th>주최자</th>
          </tr>
        </thead>
        <tbody>
          {myProblems.map((problem, index) => (
            <tr>
              <td>{index+1}</td>
              <td style={{cursor:"pointer"}} onClick={() => {goToProblem(problem.id)}}>{problem.problemName}</td>
              <td>{problem.userId}</td>
            </tr>
        ))}
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
  const myContests = contests.filter(contest => contest.userId === user.userId);
  const navigate = useNavigate();

  const goToContest = (id:number) => {
    navigate(`/contest/${id}`)
  }

  return (
    <div className="total-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>대회 이름</th>
            <th>주최자</th>
          </tr>
        </thead>
        <tbody>
          {myContests.map((contest, index) => (
            <tr>
              <td>{index+1}</td>
              <td style={{cursor:"pointer"}} onClick={() => {goToContest(contest.id)}}>{contest.contestName}</td>
              <td>{contest.userId}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

const UserManage: React.FC<UserProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [numbers, setNumbers] = useState<string[]>([]);

  const addNumberField = useCallback((num: string) => {
    setNumbers([...numbers, num]);
  }, [numbers])

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNumbers = [...numbers];
    updatedNumbers[index] = event.target.value;
    setNumbers(updatedNumbers);
  };

  useEffect(() => {
    if (user.authority === 5) {
      severArrayRetry('users', setUsers)
    }
  }, [user.authority]);

  useEffect(() => {
    users.forEach((user) => {
      addNumberField(user.authority.toString())
    })
  }, [users, addNumberField])

  return (
    <div className="total-container">
      {user.authority !== 5 && <div>권한이 없음</div>}
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.email}</td>
              <td><input type="number" value={numbers[index]} onChange={(event) => handleChange(index, event)} min="0" max="5" step="1"></input></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}