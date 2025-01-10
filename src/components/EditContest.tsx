import React, { useEffect, useRef, useState } from "react";
import { Contest, User } from "../model/talbe";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../model/server";

interface EditContestProps {
  user: User
  contests: Contest[]
}

const EditContest: React.FC<EditContestProps> = ({ user, contests }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editMessage, setEditMessage] = useState<string>('')
  const contest = contests.filter(contest => contest.id === Number(id));
  const userIdRef = useRef<HTMLInputElement | null>(null);
  const contestNameRef = useRef<HTMLInputElement | null>(null);
  const contestPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const eventTimeRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userIdRef.current &&
      contestNameRef.current &&
      contestPasswordRef.current &&
      contestCheckPasswordRef.current &&
      contestDescriptionRef.current &&
      eventTimeRef.current &&
      timeRef.current) {
      userIdRef.current.value = contest[0].userId
      contestNameRef.current.value = contest[0].contestName
      contestPasswordRef.current.value = contest[0].contestPw
      contestCheckPasswordRef.current.value = contest[0].contestPw
      contestDescriptionRef.current.value = contest[0].contestDescription
      const date = new Date(contest[0].eventTime);
      const timezoneOffset = date.getTimezoneOffset() * 60000;  // 분 단위 오프셋 → ms로 변환
      const localDate = new Date(date.getTime() - timezoneOffset);
      const formattedDateTime = localDate.toISOString().slice(0, 16);
      eventTimeRef.current.value = formattedDateTime;
      timeRef.current.value = contest[0].time.toString()
    }
  }, [contest]);

  const handleSubmit = async () => {
    if (userIdRef.current &&
      contestNameRef.current &&
      contestPasswordRef.current &&
      contestCheckPasswordRef.current &&
      contestDescriptionRef.current &&
      eventTimeRef.current &&
      timeRef.current) {
      setEditMessage("")
      if (userIdRef.current.value === user.userId && user.userId !== "") {
        if (contestPasswordRef.current.value === contestCheckPasswordRef.current.value) {
          if (contestNameRef.current.value !== '') {
            const localDateTime = eventTimeRef.current.value;
            const isoDateTime = new Date(localDateTime).toISOString();

            const response = await axios.put(url + `contests/${id}`, {
              userId: userIdRef.current.value,
              contestName: contestNameRef.current.value,
              contestDescription: contestDescriptionRef.current.value,
              contestPw: contestPasswordRef.current.value,
              eventTime: isoDateTime,
              time: timeRef.current.value
            }, { timeout: 10000 });

            if (response.data === "") {
              setEditMessage("서버 에러")
            } else {
              console.log(`contest edit load complete`);
              navigate(`/contest/${id}`)
              window.location.reload()
            }
          } else {
            setEditMessage("이름 작성 필요")
          }
        } else {
          setEditMessage("비밀번호 불일치")
        }
      } else {
        setEditMessage("아이디 불일치")
      }
    }
  }

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
          <span>{editMessage}</span>
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
          <div className="makeButton" onClick={handleSubmit}>대회 편집</div>
        </div>
      }
    </div>
  )
}

export default EditContest