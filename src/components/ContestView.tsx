import React from "react"
import { useParams } from "react-router-dom"
import { Contest, mathJaxConfig, Problem, Solved, User } from "../model/talbe"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import './css/ContestView.css'
import CommonFunction from "../model/CommonFunction"


interface ContestViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
  solveds: Solved[]
}

const ContestView: React.FC<ContestViewProps> = ({ user, contests, problems, solveds }) => {
  const { deleteContest, goToContestEdit, goToMakeProblem, goToProblemId, goToScoreBoard, goToUserId } = CommonFunction();
  const { id } = useParams();
  const contest = contests.find(contest => contest.id === Number(id));
  const contestProblems = problems.filter(problem => problem.contestId === Number(id)).sort((a, b) => a.id - b.id);

  if (!contest) return <></>

  if (new Date(contest.eventTime) >= new Date() && user.authority != 5 && user.userId !== contest.userId) return (<div>아직 아님</div>)

  return (
    <div>
      <div className="ContestName">{contest?.contestName}</div>
      <div className="ContestDescription">{contest?.contestDescription}</div>
      <div className="ContestUserId">주최자 : <span onClick={() => { goToUserId(contest.userId) }}>{contest.userId}</span></div>
      {(user.authority === 5 || user.userId === contest?.userId) &&
        <div className="owner" style={{ marginTop: '30px' }}>
          <span className="editButton" onClick={() => { goToContestEdit(contest.id) }}>편집</span>
          <span className="deleteButton" onClick={() => { deleteContest(contest.id) }}>삭제</span>
        </div>
      }
      {(() => {
        const now = new Date();

        const event = new Date(contest?.eventTime);
        const finish = new Date(contest?.eventTime);
        finish.setMinutes(finish.getMinutes() + contest?.time);

        if (now < event || finish <= now) return <></>

        return (
          <div className="owner">
            <span onClick={() => { goToScoreBoard(contest.id) }} className="editButton" style={{ marginTop: "30px" }}>스코어보드</span>
          </div>
        )
      })()}
      <div className="list-container">
        <div className='list' style={{ maxWidth: "600px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "30px", textAlign: "center" }}>번호</th>
                <th>문제 제목</th>
                <th style={{ width: "50px", textAlign: "center" }}>해결</th>
              </tr>
            </thead>
            <tbody>
              <MathJaxContext config={mathJaxConfig}>
                {contestProblems.map((problem, index) => (
                  <tr className='element' key={problem.id}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td onClick={() => { goToProblemId(problem.id) }}><MathJax>{problem.problemName}</MathJax></td>
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
          {(user.authority === 5 || user.userId === contest?.userId) &&
            <div className="owner">
              <span className="addProblem" onClick={() => { goToMakeProblem(contest.id) }}>문제 추가</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ContestView