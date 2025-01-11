import React from 'react'
import { Contest, mathJaxConfig, Problem, Solved, User } from '../model/talbe'
import './css/List.css'
import CommonFunction from '../model/CommonFunction'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

interface ProblemListProps {
  user: User
  contests: Contest[]
  problems: Problem[]
  solveds: Solved[]
}

const ProblemList: React.FC<ProblemListProps> = ({ user, contests, problems, solveds }) => {
  const { goToMakeProblem, goToProblemId } = CommonFunction()
  const finishProblems = problems.filter((problem) => {
    const contest = contests.find((contest) => contest.id === problem.contestId);

    if (!contest) return true;

    const now = new Date()
    const finish = new Date(contest.eventTime)
    finish.setMinutes(finish.getMinutes() + contest.time)

    return finish < now;
  })

  return (
    <div className="list-container">
      <div className='list'>
        <h1>문제 목록</h1>
        {user.authority >= 3 && <h3 onClick={() => { goToMakeProblem(-1) }}>문제 추가</h3>}
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
          <MathJaxContext config={mathJaxConfig}>
            {finishProblems.map((problem, index) => (
              <tr className='element' onClick={() => { goToProblemId(problem.id) }} key={problem.id}>
                <td>{index + 1}</td>
                <td><MathJax>{problem.id}. {problem.problemName}</MathJax></td>
                <td>
                  {(() => {
                    const contest = contests.filter((contest) => contest.id == problem.contestId)[0];
                    return <>{contest?.contestName}</>
                  })()}
                </td>
                <td>
                  {(() => {
                    const filtered = solveds.filter((solved) => solved.userId === user.userId && solved.problemId === problem.id);

                    if (filtered.length === 0) return <></>;

                    const score = filtered[0].score;
                    let style = { backgroundColor: "rgb(238, 255, 0)" };
                    if (score === "100") style.backgroundColor = "rgb(43, 255, 0)";
                    if (score === "0") style.backgroundColor = "rgb(255, 0, 0)";

                    return <div className="solved" style={style}>{score}</div>;
                  })()}
                </td>
              </tr>
            ))}
            </MathJaxContext>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemList;
