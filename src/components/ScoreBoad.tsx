import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { URL, Contest, ContestScoreDTO, Problem, mathJaxConfig, ApiResponse } from '../model/talbe'
import axios, { AxiosError } from 'axios'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

interface ScoreBoardProps {
  contests: Contest[]
  problems: Problem[]
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ contests, problems }) => {
  const { id } = useParams();
  const [contestScores, setContestScores] = useState<ContestScoreDTO[]>([]);

  const nowContest = contests.filter((contest) => contest.id == Number(id));
  const nowProblmes = problems.filter((problem) => problem.contestId == Number(id)).sort((a, b) => a.id - b.id);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post<ApiResponse<ContestScoreDTO[]>>(URL + `data/${id}`, null, { timeout: 10_000 });
        setContestScores(response.data.data.sort((a, b) => {
          let sumA = 0;
          let sumB = 0;
          for (let i = 0; i < a.solveProblems.length; i++) {
            sumA += Number(a.solveProblems[i].score);
            sumB += Number(b.solveProblems[i].score);
          }
          return sumB - sumA;
        }));
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message);
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    fetchData();

    const interval = setInterval(fetchData, 15_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="list">
        <h2>대회명 : {nowContest[0]?.contestName}</h2>
        <table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: "30px", textAlign: "center" }}>등수</th>
              <th style={{ width: `calc((100% - 85px) / ${nowProblmes.length + 1})`, textAlign: "center" }}>이름</th>
              <MathJaxContext config={mathJaxConfig}>
                {nowProblmes.map((problem, index) => (
                  <th key={index} style={{ width: `calc((100% - 85px) / ${nowProblmes.length + 1})`, textAlign: "center" }}>
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