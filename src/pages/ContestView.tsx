import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MathJax, MathJaxContext } from "better-react-mathjax"
import { AxiosError } from "axios"
import { deleteContestById, getContestById } from "../api/contest"
import { getAllProblemsByContestId } from "../api/problem"
import { mathJaxConfig } from "../constants/mathJaxConfig"
import { useUser } from "../context/UserContext"
import { Contest } from "../types/Contest"
import { Problem } from "../types/Problem"
import useNavigation from "../hooks/useNavigation"
import '../styles/ContestView.css'

const ContestView: React.FC = () => {
  const { user, solves } = useUser()
  const { goToContestEdit, goToProblemMake, goToProblemId, goToContestScoreBoard, goToUserId, goToContest } = useNavigation();
  const { contestId } = useParams();
  const [contest, setContest] = useState<Contest>()
  const [problems, setProblems] = useState<Problem[]>([])

  useEffect(() => {
      async function loadContest() {
        try {
          const response = await getContestById(Number(contestId));
          setContest(response.data);
        } catch (error) { 
          if (error instanceof AxiosError) {
            if (error.response) console.error("응답 에러: ", error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
         }
      }
      async function loadProblems() {
        try {
          const response = await getAllProblemsByContestId(Number(contestId));
          setProblems(response.data.sort((a, b) => a.id! - b.id!));
        } catch (error) { 
          if (error instanceof AxiosError) {
            if (error.response) console.error("응답 에러: ", error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
         }
      }
      loadContest();
      loadProblems();
    }, []);

  if (!contest) return <></>

  if (contest.startTime != null && new Date(contest.startTime) >= new Date() && user.authority != 5 && user.userId !== contest.userId) return (<div>아직 아님</div>)

  const deleteContest = async (contestId: number) => {
    try {
      await deleteContestById(contestId);
      goToContest();
      window.location.reload();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) console.error("응답 에러: ", error.response.data.message);
        else console.error("서버 에러: ", error)
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  return (
    <div>
      <div className="ContestName">{contest?.contestName}</div>
      <div className="ContestDescription">{contest?.contestDescription}</div>
      <div className="ContestUserId">주최자 : <span onClick={() => { goToUserId(contest.userId) }}>{contest.userId}</span></div>
      {(user.authority === 5 || user.userId === contest?.userId) &&
        <div className="owner" style={{ marginTop: '30px' }}>
          <span className="editButton" onClick={() => { goToContestEdit(contest.id!) }}>편집</span>
          <span className="deleteButton" onClick={() => { deleteContest(contest.id!) }}>삭제</span>
        </div>
      }
      {(() => {
        const now = new Date();
        if (contest.startTime == null) return <></>
        if (contest.endTime == null) return <></>

        const event = new Date(contest.startTime);
        const finish = new Date(contest.endTime);

        if (now < event || finish <= now) return <></>

        return (
          <div className="owner">
            <span onClick={() => { goToContestScoreBoard(contest.id!) }} className="editButton" style={{ marginTop: "30px" }}>스코어보드</span>
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
                {problems.map((problem, index) => (
                  <tr className='element' key={problem.id}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td onClick={() => { goToProblemId(problem.id!) }}><MathJax>{problem.problemName}</MathJax></td>
                    <td>
                      {(() => {
                        const filtered = solves.filter((solve) => solve.userId === user.userId && solve.problemId === problem.id);

                        if (filtered.length === 0) return <></>;

                        const score = filtered[0].score;
                        let style = { backgroundColor: "rgb(238, 255, 0)" };
                        if (score === 1000) style.backgroundColor = "rgb(43, 255, 0)";
                        if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

                        return <div className="solve" style={style}>{score / 10}</div>;
                      })()}
                    </td>
                  </tr>
                ))}
              </MathJaxContext>
            </tbody>
          </table>
          {(user.authority === 5 || user.userId === contest?.userId) &&
            <div className="owner">
              <span className="addProblem" onClick={() => { goToProblemMake(contest.id!) }}>문제 추가</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ContestView