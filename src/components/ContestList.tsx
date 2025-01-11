import React from 'react'
import { Contest, User } from '../model/talbe'
import './css/List.css'
import CommonFunction from '../model/CommonFunction'

interface ContestListProps {
  user: User
  contests: Contest[]
}

const ContestList: React.FC<ContestListProps> = ({ user, contests }) => {
  const { goToContestId, goToMakeContest, TimeFormat } = CommonFunction()
  const cont = (index: number, contest: Contest, color: string, pop: boolean) => {
    return (
      <tr className='element' style={{ backgroundColor: color }} onClick={() => { goToContestId(user, contest, pop) }} key={contest.id}>
        <td>{index + 1}</td>
        <td>{contest.contestName}</td>
        <td>{contest.userId}</td>
        <td>{TimeFormat(contest.eventTime, 0)}</td>
        <td>{TimeFormat(contest.eventTime, contest.time)}</td>
      </tr>
    )
  }

  return (
    <div className="list-container">
      <div className='list'>
        <h1>대회 목록</h1>
        {user.authority >= 3 && <h3 onClick={goToMakeContest}>대회 개최</h3>}
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
              const now = new Date()
              const event = new Date(contest.eventTime)
              const finish = new Date(contest.eventTime)
              finish.setMinutes(finish.getMinutes() + contest.time)


              if (now < event) return cont(index, contest, "rgb(142, 142, 142)", true)
              if (user.contest == contest.id) return cont(index, contest, "rgb(255, 255, 255)", false)
              if (contest.contestPw != '' && now <= finish) return cont(index, contest, "rgb(255, 100, 100)", true)
              else if (now <= finish) return cont(index, contest, "rgb(216, 216, 216)", false)
              return cont(index, contest, "rgb(255, 255, 255)", false)
            })}
              
          </tbody>
        </table>
      </div>
    </div>
  );
}



export default ContestList;
