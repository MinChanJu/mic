import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserByUserId } from "../api/user"
import { UserDTO } from "../types/dto/UserDTO"
import { resultInterval } from "../utils/resultInterval"
import ErrorPage from "../components/ErrorPage"
import Loading from "../components/Loading"

const UserView: React.FC = () => {
  const { userId } = useParams();
  const [curUser, setCurUser] = useState<UserDTO>();
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  const [day, setDay] = useState<string>();
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function serverObject() {
      let requestId = '';
      try {
        const response = await getUserByUserId(userId!)
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }

      resultInterval("users", requestId, setError, setLoad, setCurUser);
    }
    serverObject();
  }, []);

  useEffect(() => {
    setYear(curUser?.createdAt.substring(0, 4))
    setMonth(curUser?.createdAt.substring(5, 7))
    setDay(curUser?.createdAt.substring(8, 10))
  }, [curUser])

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />
  if (!curUser) return <ErrorPage />

  return (
    <div className="list" style={{ maxWidth: "400px" }}>
      <div className="description text30">정보</div>
      <div className="userElement">
        <div className="text20">닉네임: {curUser.name}</div>
        <div className="text20">아이디: {curUser.userId}</div>
        <div className="text20">이메일: {curUser.email}</div>
        <div className="text20">가입 날짜: {year}년 {month}월 {day}일</div>
      </div>
    </div>
  )
}

export default UserView