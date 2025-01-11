import React, { useRef, useState } from "react"
import { URL, Contest, User } from "../model/talbe"
import axios from "axios"
import "./css/ContestMake.css"
import "./css/styles.css"
import CommonFunction from "../model/CommonFunction"

interface ContestMakeProps {
  user: User
}

const ContestMake: React.FC<ContestMakeProps> = ({ user }) => {
  const { goToMakeProblem } = CommonFunction()
  const [makeMessage, setMakeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userIdRef = useRef<HTMLInputElement>(null);
  const contestNameRef = useRef<HTMLInputElement>(null);
  const contestPasswordRef = useRef<HTMLInputElement>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const eventTimeRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true)
    setMakeMessage("")
    if (userIdRef.current &&
      contestNameRef.current &&
      contestPasswordRef.current &&
      contestCheckPasswordRef.current &&
      contestDescriptionRef.current &&
      eventTimeRef.current &&
      timeRef.current) {
      if (userIdRef.current.value === user.userId && user.userId !== "") {
        if (contestPasswordRef.current.value === contestCheckPasswordRef.current.value) {
          if (contestNameRef.current.value !== '') {
            const localDateTime = eventTimeRef.current.value;
            const isoDateTime = new Date(localDateTime).toISOString();

            const requestData: Contest = {
              id: -1,
              userId: userIdRef.current.value,
              contestName: contestNameRef.current.value,
              contestDescription: contestDescriptionRef.current.value,
              contestPw: contestPasswordRef.current.value,
              eventTime: isoDateTime,
              time: Number(timeRef.current.value),
              createdAt: new Date().toISOString()
            };

            try {
              const response = await axios.post<Contest>(URL + `contests/create`, requestData, { timeout: 10000 });
              const contestR: Contest = response.data

              if (contestR.id == -1) setMakeMessage("대회 이름 중복")
              else goToMakeProblem(contestR.id)
            } catch (error) {setMakeMessage("서버 오류")}
            
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
              <input className="makeField" ref={eventTimeRef} type="datetime-local" />
            </div>
            <div className="make-group">
              <div className="makeTitle">대회 진행 시간 (분 단위)</div>
              <input className="makeField" ref={timeRef} type="number" min={0} max={3000} step={5} />
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