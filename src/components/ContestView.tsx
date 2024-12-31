import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contest, Problem, User } from "../model/talbe";
import './css/ContestView.css';
import { serverNoReturnRetry } from "../model/serverRetry";
import { MathJaxContext } from "better-react-mathjax";

interface ContestViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
}

const ContestView: React.FC<ContestViewProps> = ({ user, contests, problems }) => {
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
    serverNoReturnRetry(`contests/${contestId}`, null, "delete", "/contest", navigate)
  }

  const goToProblemMake = () => {
    navigate('/problem/make')
  }

  const goToContestEdit = () => {
    navigate(`/contest/edit/${id}`)
  }

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
        <div className='list'>
          <MathJaxContext config={mathJaxConfig}>
            {contestProblems.map((problem, index) => (
              <div className='element' onClick={() => { goToProblemId(problem.id) }} key={problem.id}>
                <h4>{index + 1}. {problem.problemName}</h4>
                {problem.problemDescription.length > 50 && <p>{problem.problemDescription.slice(0, 50)} ...</p>}
                {problem.problemDescription.length <= 50 && <p>{problem.problemDescription}</p>}
              </div>
            ))}
          </MathJaxContext>
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