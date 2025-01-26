import React, { useState } from "react"
import { AxiosError } from "axios"
import { createContest } from "../api/contest"
import { useUser } from "../context/UserContext"
import { Contest, InitContest } from "../types/entity/Contest"
import useNavigation from "../hooks/useNavigation"
import Loading from "../components/Loading"
import { StringToTime } from "../utils/formatter"

const ContestMake: React.FC = () => {
  const { user } = useUser()
  const { goToProblemMake } = useNavigation()
  const [makeMessage, setMakeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contest, setContest] = useState<Contest>(InitContest);
  const [checkPassword, setCheckPassword] = useState<string>('');

  const handleSubmit = async () => {
    setMakeMessage("")
    setIsLoading(true)

    if (contest.userId === user.userId && user.userId !== "") {
      if (contest.contestPw === checkPassword) {
        if (contest.contestName !== '') {
          if (contest.startTime !== null || contest.endTime === null) {
            contest.createdAt = new Date().toISOString()

            try {
              const response = await createContest(contest);
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
          <div className="makeGroup">
            <div className="makeTitle">본인 아이디</div>
            <input className="makeField" value={contest.userId} onChange={(e) => setContest({ ...contest, "userId": e.target.value })} type="text" />
          </div>
          <div className="makeGroup">
            <div className="makeTitle">대회 제목</div>
            <input className="makeField" value={contest.contestName} onChange={(e) => setContest({ ...contest, "contestName": e.target.value })} type="text" />
          </div>
          <div className="doubleMakeGroup">
            <div className="makeGroup">
              <div className="makeTitle">대회 비밀번호</div>
              <input className="makeField" value={contest.contestPw || ""} onChange={(e) => setContest({ ...contest, "contestPw": e.target.value || null })} type="password" />
            </div>
            <div className="makeGroup">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} type="password" />
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="doubleMakeGroup">
            <div className="makeGroup">
              <div className="makeTitle">대회 개최 시간</div>
              <input className="makeField" value={contest.startTime ? StringToTime(contest.startTime) : ""} onChange={(e) => setContest({ ...contest, "startTime": e.target.value ? new Date(e.target.value).toISOString() : null })} type="datetime-local" />
            </div>
            <div className="makeGroup">
              <div className="makeTitle">대회 종료 시간</div>
              <input className="makeField" value={contest.endTime ? StringToTime(contest.endTime) : ""} onChange={(e) => setContest({ ...contest, "endTime": e.target.value ? new Date(e.target.value).toISOString() : null })} type="datetime-local" />
            </div>
          </div>
          <div className="makeGroup">
            <div className="makeTitle">대회 설명</div>
            <textarea className="makeField" value={contest.contestDescription} onChange={(e) => setContest({ ...contest, "contestDescription": e.target.value })} style={{ height: '100px' }} />
          </div>
          <span className="red">{makeMessage}</span>
          <div className="makeButton" onClick={handleSubmit}>
            {isLoading ? <Loading /> : <div>대회 개최</div>}
          </div>
        </div>
      }
    </div>
  )
}

export default ContestMake