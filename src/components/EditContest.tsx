import React, { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { URL, Contest, User } from "../model/talbe"
import axios from "axios"
import CommonFunction from "../model/CommonFunction"

interface EditContestProps {
  user: User
  contests: Contest[]
}

const EditContest: React.FC<EditContestProps> = ({ user, contests }) => {
  const { goToContestId } = CommonFunction()
  const { id } = useParams();
  const [editMessage, setEditMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const contest = contests.find(contest => contest.id === Number(id));
  const userIdRef = useRef<HTMLInputElement>(null);
  const contestNameRef = useRef<HTMLInputElement>(null);
  const contestPasswordRef = useRef<HTMLInputElement>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const eventTimeRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  if (!contest) return <></>

  const handleSubmit = async () => {
    setIsLoading(true)
    setEditMessage("")
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
              id: contest.id,
              userId: userIdRef.current.value,
              contestName: contestNameRef.current.value,
              contestDescription: contestDescriptionRef.current.value,
              contestPw: contestPasswordRef.current.value,
              eventTime: isoDateTime,
              time: Number(timeRef.current.value),
              createdAt: contest.createdAt,
            };

            try {
              const response = await axios.put<Contest>(URL + 'contests/update', requestData, { timeout: 10000 });
              const contestR: Contest = response.data

              if (contestR.id == -1) setEditMessage("존재하지 않는 대회")
              else {
                goToContestId(user, contestR, false);
                window.location.reload()
              }
            } catch (error) { setEditMessage("서버 오류") }
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
    setIsLoading(false)
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
            <input className="makeField" ref={userIdRef} type="text" />
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 제목</div>
            <input className="makeField" ref={contestNameRef} defaultValue={contest.contestName} type="text" />
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 비밀번호</div>
              <input className="makeField" ref={contestPasswordRef} defaultValue={contest.contestPw} type="password" />
            </div>
            <div className="make-group">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" ref={contestCheckPasswordRef} defaultValue={contest.contestPw} type="password" />
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 개최 시간</div>
              <input className="makeField" ref={eventTimeRef} defaultValue={(() => {
                const date = new Date(contest.eventTime);
                const timezoneOffset = date.getTimezoneOffset() * 60000;  // 분 단위 오프셋 → ms로 변환
                const localDate = new Date(date.getTime() - timezoneOffset);
                return localDate.toISOString().slice(0, 16);
              })()} type="datetime-local" />
            </div>
            <div className="make-group">
              <div className="makeTitle">대회 진행 시간 (분 단위)</div>
              <input className="makeField" ref={timeRef} defaultValue={contest.time} type="number" min={0} max={3000} step={5} />
            </div>
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 설명</div>
            <textarea className="makeField" ref={contestDescriptionRef} defaultValue={contest.contestDescription} style={{ height: '100px' }} />
          </div>
          <div className="makeButton" onClick={handleSubmit}>{isLoading ? <div className="loading"></div> : <>대회 편집</>}</div>
        </div>
      }
    </div>
  )
}

export default EditContest