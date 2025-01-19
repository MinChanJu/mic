import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { getContestById, updateContest } from "../api/contest"
import { useUser } from "../context/UserContext"
import { Contest } from "../types/Contest"
import { StringToTime } from "../utils/formatter"
import useNavigation from "../hooks/useNavigation"


const EditContest: React.FC = () => {
  const { user } = useUser();
  const { goToContestId } = useNavigation()
  const { contestId } = useParams();
  const [editMessage, setEditMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contest, setContest] = useState<Contest>();
  const userIdRef = useRef<HTMLInputElement>(null);
  const contestNameRef = useRef<HTMLInputElement>(null);
  const contestPasswordRef = useRef<HTMLInputElement>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadContest() {
      try {
        const response = await getContestById(Number(contestId));
        setContest(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    loadContest();
  }, []);

  if (!contest) return <></>

  const handleSubmit = async () => {
    setIsLoading(true)
    setEditMessage("")
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
            const startTime = new Date(startTimeRef.current.value).toISOString();
            const endTime = new Date(endTimeRef.current.value).toISOString();

            const requestData: Contest = {
              id: contest.id,
              userId: userIdRef.current.value,
              contestName: contestNameRef.current.value,
              contestDescription: contestDescriptionRef.current.value,
              contestPw: contestPasswordRef.current.value,
              startTime: startTime,
              endTime: endTime,
              createdAt: contest.createdAt,
            };

            try {
              const response = await updateContest(requestData);
              goToContestId(response.data.id!);
              window.location.reload()
            } catch (error) {
              if (error instanceof AxiosError) {
                if (error.response) setEditMessage("응답 에러: " + error.response.data.message);
                else console.error("서버 에러: ", error)
              } else {
                console.error("알 수 없는 에러:", error);
              }
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
              <input className="makeField" ref={contestPasswordRef} defaultValue={contest.contestPw == null ? "" : contest.contestPw} type="password" />
            </div>
            <div className="make-group">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" ref={contestCheckPasswordRef} defaultValue={contest.contestPw == null ? "" : contest.contestPw} type="password" />
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 개최 시간</div>
              <input className="makeField" ref={startTimeRef} defaultValue={contest.startTime == null ? "" : StringToTime(contest.startTime)} type="datetime-local" />
            </div>
            <div className="make-group">
              <div className="makeTitle">대회 진행 시간 (분 단위)</div>
              <input className="makeField" ref={endTimeRef} defaultValue={contest.endTime == null ? "" : StringToTime(contest.endTime)} type="datetime-local" />
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