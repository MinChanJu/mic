import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { AxiosError } from 'axios'
import { getContestById } from '../api/contest'
import { getProblemListByContestIdWithUserId } from '../api/problem'
import { getScoreBoardByContestId } from '../api/myData'
import { mathJaxConfig } from '../constants/mathJaxConfig'
import { ContestScoreDTO } from '../types/dto/ContestScoreDTO'
import { Contest } from '../types/entity/Contest'
import { ProblemListDTO } from '../types/dto/ProblemListDTO'


const ScoreBoard: React.FC = () => {
  const { contestId } = useParams();
  const [contestScores, setContestScores] = useState<ContestScoreDTO[]>([]);

  const [contest, setContest] = useState<Contest>();
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([]);

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
        const response = await getProblemListByContestIdWithUserId(Number(contestId), '');
        setProblemList(response.data);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getScoreBoardByContestId(Number(contestId));
        setContestScores(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    fetchData();

    const interval = setInterval(fetchData, 15_000);

    return () => clearInterval(interval);
  }, []);

  if (!contest) return <></>

  return (
    <div>
      <div className="list">
        <h2>대회명 : {contest.contestName}</h2>
        <table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: "30px", textAlign: "center" }}>등수</th>
              <th style={{ width: `calc((100% - 85px) / ${problemList.length + 1})`, textAlign: "center" }}>이름</th>
              <MathJaxContext config={mathJaxConfig}>
                {problemList.map((problem, index) => (
                  <th key={index} style={{ width: `calc((100% - 85px) / ${problemList.length + 1})`, textAlign: "center" }}>
                    <MathJax>{problem.problemName}</MathJax>
                  </th>
                ))}
              </MathJaxContext>
              <th style={{ width: "55px", textAlign: "center" }}>총점</th>
            </tr>
          </thead>
          <tbody>
            {contestScores.map((contestScore, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>{contestScore.name}</td>
                {contestScore.solveProblems.sort((a, b) => a.problemId - b.problemId).map((solve) => {
                  const score = solve.score;
                  let style: React.CSSProperties = { textAlign: "center", backgroundColor: "rgb(238, 255, 0)" };
                  if (score === 100) style.backgroundColor = "rgb(43, 255, 0)";
                  if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

                  return <td key={solve.problemId} style={style}>{score}</td>
                })}
                {(() => {
                  let sum = 0;
                  contestScore.solveProblems.map((solve) => (
                    sum += Number(solve.score)
                  ))
                  return <td style={{ textAlign: "center" }}>{sum}</td>
                })()}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScoreBoard;