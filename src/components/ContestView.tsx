import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contest, Problem, Solved, User } from "../model/talbe";
import './css/ContestView.css';
import { url } from "../model/server";
import { MathJaxContext } from "better-react-mathjax";
import axios from "axios";

interface ContestViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
  solveds: Solved[]
}

const ContestView: React.FC<ContestViewProps> = ({ user, contests, problems, solveds }) => {
  const { id } = useParams();
  const contest = contests.filter(contest => contest.id === Number(id));
  const contestProblems = problems
    .filter(problem => problem.contestId === Number(id))
    .sort((a, b) => a.id - b.id);
  const navigate = useNavigate();
  const mathJaxConfig = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],  // 인라인 수식 기호 설정
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],  // 블록 수식 기호 설정
      packages: ["base", "ams"]  // 필요한 패키지들만 로드
    },
    loader: { load: ["[tex]/ams"] },  // AMS 패키지 로드
  };

  const goToProblemId = (problemId: number) => {
    navigate(`/problem/${problemId}`);
  };

  const goToUserId = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const deleteContest = (contestId: number) => {
    async function serverNoReturn() {
      await axios.delete(url + `contests/${contestId}`, { timeout: 10000 });
      navigate("/contest")
      window.location.reload()
    }
    serverNoReturn();
  }

  const goToProblemMake = () => {
    navigate('/problem/make')
  }

  const goToContestEdit = () => {
    navigate(`/contest/edit/${id}`)
  }

  if (new Date(contest[0].eventTime) >= new Date() && user.authority != 5 && user.userId !== contest[0].userId) return (<div>아직 아님</div>)

  return (
    <div>
      <div className="ContestName">{contest[0]?.contestName}</div>
      <div className="ContestDescription">{contest[0]?.contestDescription}</div>
      <div className="ContestUserId">주최자 : <span onClick={() => { goToUserId(contest[0]?.userId) }}>{contest[0]?.userId}</span></div>
      {(user.authority === 5 || user.userId === contest[0]?.userId) &&
        <div className="owner" style={{ marginTop: '30px' }}>
          <span className="editButton" onClick={goToContestEdit}>편집</span>
          <span className="deleteButton" onClick={() => { deleteContest(contest[0].id) }}>삭제</span>
        </div>
      }
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
                    <td onClick={() => { goToProblemId(problem.id) }}>{problem.problemName}</td>
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
              </MathJaxContext>
            </tbody>
          </table>
          {(user.authority === 5 || user.userId === contest[0]?.userId) &&
            <div className="owner">
              <span className="addProblem" onClick={goToProblemMake}>문제 추가</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ContestView