import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { AxiosError } from 'axios'
import { getAllContests } from '../api/contest'
import { Contest } from '../types/Contest'
import { TimeToString } from '../utils/formatter'
import useNavigation from '../hooks/useNavigation'
import '../styles/List.css'

const ContestList: React.FC = () => {
  const { user } = useUser();
  const [contests, setContests] = useState<Contest[]>([]);
  const { goToContestId, goToContestMake } = useNavigation()

  useEffect(() => {
    async function loadProblems() {
      try {
        const response = await getAllContests();
        setContests(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    loadProblems();
  }, []);

  const cont = (index: number, contest: Contest, color: string, pop: boolean) => {
    return (
      <tr className='element' style={{ backgroundColor: color }} onClick={() => {
        if (pop) alert("아직 대회시간이 아닙니다.")
        else goToContestId(contest.id!)
      }} key={contest.id}>
        <td>{index + 1}</td>
        <td>{contest.contestName}</td>
        <td>{contest.userId}</td>
        <td>{contest.startTime == null ? "" : TimeToString(contest.startTime)}</td>
        <td>{contest.endTime == null ? "" : TimeToString(contest.endTime)}</td>
      </tr>
    )
  }

  return (
    <div className="list-container">
      <div className='list'>
        <h1>대회 목록</h1>
        {user.authority >= 3 && <h3 onClick={goToContestMake}>대회 개최</h3>}
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>대회 제목</th>
              <th>주최</th>
              <th>시작</th>
              <th>종료</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => {
              if (contest.startTime == null) return cont(index, contest, "rgb(255, 255, 255)", false)
              const now = new Date()
              const event = new Date(contest.startTime)
              
              if (now < event) {
                if (contest.userId === user.userId) return cont(index, contest, "rgb(142, 142, 142)", false)
                if (user.authority === 5) return cont(index, contest, "rgb(142, 142, 142)", false)

                return cont(index, contest, "rgb(142, 142, 142)", true)
              }

              if (contest.endTime == null) return cont(index, contest, "rgb(255, 255, 255)", false)
              const finish = new Date(contest.endTime)

              if (now <= finish) {
                if (contest.userId === user.userId) return cont(index, contest, "rgb(255, 100, 100)", false)
                if (user.authority === 5) return cont(index, contest, "rgb(255, 100, 100)", false)

                if (contest.contestPw == null) return cont(index, contest, "rgb(0, 255, 0)", false)
                if (contest.id == user.contestId) return cont(index, contest, "rgb(0, 255, 0)", false)

                return cont(index, contest, "rgb(255, 100, 100)", true)
              }
              
              return cont(index, contest, "rgb(255, 255, 255)", false)
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
}



export default ContestList;
