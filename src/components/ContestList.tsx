import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contest, CurrentContest, User } from '../model/talbe';
import './css/List.css';

interface ContestListProps {
  user: User,
  contests: Contest[]
  setCurrentContest: React.Dispatch<React.SetStateAction<CurrentContest>>;
}

const ContestList: React.FC<ContestListProps> = ({ user, contests, setCurrentContest }) => {
  const navigate = useNavigate();

  const showPopUp = () => {
    alert("아직 대회 시작 시간이 안되었습니다.");
  }

  const goToContestId = (contest: Contest) => {
    if (new Date() < new Date(contest.eventTime)) showPopUp();
    else {
      setCurrentContest({ contestId: contest.id, contestName: contest.contestName })
      navigate(`/contest/${contest.id}`);
    }
  };

  const goToMakeContest = () => {
    navigate(`/contest/make`);
  };

  const TimeFormat = (eventTime: string): string => {
    const event = new Date(eventTime);
    const year = event.getFullYear();
    const month = String(event.getMonth() + 1).padStart(2, "0");
    const day = String(event.getDate()).padStart(2, "0");
    const hours = String(event.getHours()).padStart(2, "0");
    const minutes = String(event.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  };

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
              <th>대회시간</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest, index) => (
              <tr className='element' style={new Date(contest.eventTime) >= new Date() ? {backgroundColor: "rgb(225, 223, 223)"}:{}} key={contest.id}>
                <td>{index + 1}</td>
                <td onClick={() => { goToContestId(contest) }}>{contest.contestName}</td>
                <td>{contest.userId}</td>
                <td>{TimeFormat(contest.eventTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContestList;
