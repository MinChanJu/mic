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

  const goToContestId = (contestId: number, contestName: string) => {
    setCurrentContest({ contestId: contestId, contestName: contestName })
    navigate(`/contest/${contestId}`);
  };

  const goToMakeContest = () => {
    navigate(`/contest/make`);
  };

  return (
    <div className="list-container">
      <div className='list'>
        <h1>대회 목록</h1>
        {user.authority >= 3 && <h3 onClick={goToMakeContest}>대회 개최</h3>}
        {contests.map((contest) => (
          <div className='element' onClick={() => { goToContestId(contest.id, contest.contestName) }} key={contest.id}>
            <h4>{contest.contestName}</h4>
            <p>{contest.contestDescription}</p>
            <div>주최: {contest.userId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContestList;
