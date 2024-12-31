import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Problem, User } from '../model/talbe';
import './css/List.css';

interface ProblemListProps {
  user: User,
  problems: Problem[]
}

const ProblemList: React.FC<ProblemListProps> = ({ user, problems }) => {
  const navigate = useNavigate();

  const goToProblemId = (problemId: number) => {
    navigate(`/problem/${problemId}`);
  };

  const goToMakeProblem = () => {
    navigate(`/problem/make`);
  };

  return (
    <div className="list-container">
      <div className='list'>
        <h1>문제 목록</h1>
        {user.authority >= 3 && <h3 onClick={goToMakeProblem}>문제 추가</h3>}
        {problems.map((problem) => (
          <div className='element' onClick={() => { goToProblemId(problem.id) }} key={problem.id}>
            <h4>{problem.problemName}</h4>
            <div>{problem.contestName}</div>
            {problem.contestName === "" && <div> 대회에 속하지 않음 </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemList;
