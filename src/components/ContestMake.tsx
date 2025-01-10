import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contest, CurrentContest, User } from "../model/talbe";
import { url } from "../model/server";
import axios from "axios";
import "./css/ContestMake.css"
import "./css/styles.css"

interface ContestMakeProps {
  user: User
  setCurrentContest: React.Dispatch<React.SetStateAction<CurrentContest>>;
}

const ContestMake: React.FC<ContestMakeProps> = ({ user, setCurrentContest }) => {
  const navigate = useNavigate();
  const [makeMessage, setMakeMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userIdRef = useRef<HTMLInputElement | null>(null);
  const contestNameRef = useRef<HTMLInputElement | null>(null);
  const contestPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const eventTimeRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true)
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

            let response = await axios.post(url + `contests/create`, {
              userId: userIdRef.current.value,
              contestName: contestNameRef.current.value,
              contestDescription: contestDescriptionRef.current.value,
              contestPw: contestPasswordRef.current.value,
              eventTime: isoDateTime,
              time: timeRef.current.value
            }, { timeout: 10000 });

            if (response.data === "") {
              setMakeMessage("서버 오류")
            } else {
              const contest = response.data as Contest
              setCurrentContest({ contestId: contest.id, contestName: contest.contestName })
              navigate('/problem/make')
              setMakeMessage("대회 개최 성공!")
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
            <input className="makeField" ref={userIdRef} type="text"></input>
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 제목</div>
            <input className="makeField" ref={contestNameRef} type="text" id="contestName"></input>
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 비밀번호</div>
              <input className="makeField" ref={contestPasswordRef} type="password" id="contestPassword"></input>
            </div>
            <div className="make-group">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" ref={contestCheckPasswordRef} type="password" id="contestCheckPassword"></input>
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 개최 시간</div>
              <input className="makeField" ref={eventTimeRef} type="datetime-local" id="contestName"></input>
            </div>
            <div className="make-group">
              <div className="makeTitle">대회 진행 시간 (분 단위)</div>
              <input className="makeField" ref={timeRef} type="number" min={0} max={3000} step={5} id="contestName"></input>
            </div>
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 설명</div>
            <textarea className="makeField" ref={contestDescriptionRef} style={{ height: '100px' }} id="contestDescription" />
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