import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { getUserByUserId } from "../api/user"
import { UserDTO } from "../types/UserDTO"
import "../styles/UserView.css"

const UserView: React.FC = () => {
  const { userId } = useParams();
  const [curUser, setCurUser] = useState<UserDTO>();
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  const [day, setDay] = useState<string>();

  useEffect(() => {
    async function serverObject() {
      try {
        const response = await getUserByUserId(userId!)
        setCurUser(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    serverObject();
  }, []);

  useEffect(() => {
    setYear(curUser?.createdAt.substring(0, 4))
    setMonth(curUser?.createdAt.substring(5, 7))
    setDay(curUser?.createdAt.substring(8, 10))
  }, [curUser])

  if (!curUser) return <></>

  return (
    <div className="userView">
      <h1>정보</h1>
      <div className="userElement">
        <h4>{curUser?.name}</h4>
        <div>아이디: {curUser?.userId}</div>
        <div>이메일: {curUser?.email}</div>
        <div>가입 날짜: {year}년 {month}월 {day}일</div>
      </div>
    </div>
  )
}

export default UserView