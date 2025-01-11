import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { URL, Contest, ContestScore, Problem, mathJaxConfig } from '../model/talbe'
import axios from 'axios'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

interface ScoreBoardProps {
  contests: Contest[]
  problems: Problem[]
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ contests, problems }) => {
  const { id } = useParams();
  const [contestScores, setContestScores] = useState<ContestScore[]>([]);

  const nowContest = contests.filter((contest) => contest.id == Number(id));
  const nowProblmes = problems.filter((problem) => problem.contestId == Number(id)).sort((a, b) => a.id - b.id);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post<ContestScore[]>(URL + `data/${id}`, null, { timeout: 10_000 });
        setContestScores(response.data.sort((a, b) => {
          let sumA = 0;
          let sumB = 0;
          for (let i = 0; i < a.solvedProblems.length; i++) {
            sumA += Number(a.solvedProblems[i].score);
            sumB += Number(b.solvedProblems[i].score);
          }
          return sumB - sumA;
        }));
      } catch (error) { console.log("서버 오류 " + error) }
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
                {contestScore.solvedProblems.sort((a, b) => a.problemId - b.problemId).map((solve) => {
                  const score = solve.score;
                  let style: React.CSSProperties = { textAlign: "center", backgroundColor: "rgb(238, 255, 0)" };
                  if (score === "100") style.backgroundColor = "rgb(43, 255, 0)";
                  if (score === "0") style.backgroundColor = "rgb(255, 0, 0)";

                  return <td key={solve.problemId} style={style}>{score}</td>
                })}
                {(() => {
                  let sum = 0;
                  contestScore.solvedProblems.map((solve) => (
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