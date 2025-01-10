import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contest, Problem, Solved, User } from '../model/talbe';
import './css/List.css';

interface ProblemListProps {
  user: User
  contests: Contest[]
  problems: Problem[]
  solveds: Solved[]
}

const ProblemList: React.FC<ProblemListProps> = ({ user, contests, problems, solveds }) => {
  const finishProblems = problems.filter((problem) => new Date(contests.filter((contest) => contest.id == problem.contestId)[0]?.eventTime) < new Date())
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
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>문제 제목</th>
              <th>대회</th>
              <th>해결</th>
            </tr>
          </thead>
          <tbody>
            {finishProblems.map((problem, index) => (
              <tr className='element' key={problem.id}>
                <td>{index + 1}</td>
                <td onClick={() => { goToProblemId(problem.id) }}>{problem.id}. {problem.problemName}</td>
                <td>{problem.contestName}</td>
                <td>
                  {(() => {
                    const filtered = solveds.filter((solved) => solved.userId === user.userId && solved.problemId === problem.id);

                    if (filtered.length === 0) return <></>;

                    const score = filtered[0].score;
                    const style = (score === "정답" ? { backgroundColor: "rgb(0, 255, 0)" } : { backgroundColor: "rgb(255, 0, 0)" });

                    return <div className="solved" style={style}>{score}</div>;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemList;
