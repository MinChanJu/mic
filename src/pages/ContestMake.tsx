import React, { useRef, useState } from "react"
import { AxiosError } from "axios"
import { createContest } from "../api/contest"
import { useUser } from "../context/UserContext"
import { Contest } from "../types/Contest"
import useNavigation from "../hooks/useNavigation"
import "../styles/ContestMake.css"
import "../styles/styles.css"

const ContestMake: React.FC = () => {
  const { user } = useUser()
  const { goToProblemMake } = useNavigation()
  const [makeMessage, setMakeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userIdRef = useRef<HTMLInputElement>(null);
  const contestNameRef = useRef<HTMLInputElement>(null);
  const contestPasswordRef = useRef<HTMLInputElement>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true)
    setMakeMessage("")
    if (userIdRef.current &&
      contestNameRef.current &&
      contestPasswordRef.current &&
      contestCheckPasswordRef.current &&
      contestDescriptionRef.current &&
      startTimeRef.current &&
      endTimeRef.current) {
      if (userIdRef.current.value === user.userId && user.userId !== "") {
        if (contestPasswordRef.current.value === contestCheckPasswordRef.current.value) {
          if (contestNameRef.current.value !== '') {
            if (startTimeRef.current.value !== "" || endTimeRef.current.value === "") {
              const requestData: Contest = {
                id: null,
                userId: userIdRef.current.value,
                contestName: contestNameRef.current.value,
                contestDescription: contestDescriptionRef.current.value,
                contestPw: contestPasswordRef.current.value === "" ? null : contestPasswordRef.current.value,
                startTime: startTimeRef.current.value === "" ? null : new Date(startTimeRef.current.value).toISOString(),
                endTime: endTimeRef.current.value === "" ? null : new Date(endTimeRef.current.value).toISOString(),
                createdAt: new Date().toISOString()
              };

              console.log(requestData)

              try {
                const response = await createContest(requestData);
                goToProblemMake(response.data.id!)
              } catch (error) {
                if (error instanceof AxiosError) {
                  if (error.response) setMakeMessage("응답 에러: " + error.response.data.message);
                  else console.error("서버 에러: ", error)
                } else {
                  console.error("알 수 없는 에러:", error);
                }
              }
            } else {
              setMakeMessage("죵료 시간을 입력하려면 시작 시간을 입력해야합니다.")
            }
          } else {
            setMakeMessage("이름 작성 필요")
          }
        } else {
          setMakeMessage("비밀번호 불일치")
        }
      } else {
        setMakeMessage("아이디 불일치")
      }
    }
    setIsLoading(false)
  };

  return (
    <div className="makeContainer">
      {user.authority < 3 &&
        <div className="makeBox">
          <h2>권한 없음</h2>
        </div>
      }
      {user.authority >= 3 &&
        <div className="makeBox">
          <h2>대회 정보 기입</h2>
          <div className="make-group">
            <div className="makeTitle">본인 아이디</div>
            <input className="makeField" ref={userIdRef} type="text" />
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 제목</div>
            <input className="makeField" ref={contestNameRef} type="text" />
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 비밀번호</div>
              <input className="makeField" ref={contestPasswordRef} type="password" />
            </div>
            <div className="make-group">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" ref={contestCheckPasswordRef} type="password" />
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 개최 시간</div>
              <input className="makeField" ref={startTimeRef} type="datetime-local" />
            </div>
            <div className="make-group">
              <div className="makeTitle">대회 종료 시간</div>
              <input className="makeField" ref={endTimeRef} type="datetime-local" />
            </div>
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 설명</div>
            <textarea className="makeField" ref={contestDescriptionRef} style={{ height: '100px' }} />
          </div>
          <span className="message">{makeMessage}</span>
          <div className="makeButton" onClick={handleSubmit}>
            {isLoading ? <div className="loading"></div> : <div>대회 개최</div>}
          </div>
        </div>
      }
    </div>
  )
}

export default ContestMake