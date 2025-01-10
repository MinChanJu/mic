import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contest, ContestScore, Problem } from '../model/talbe';
import { url } from '../model/server';
import axios from 'axios';

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
      const response = await axios.post<ContestScore[]>(url + `data/${id}`, null, { timeout: 10000 });
      setContestScores(response.data.sort((a, b) => {
        let sumA = 0;
        let sumB = 0;
        for (let i = 0; i < a.solvedProblems.length; i++) {
          sumA += a.solvedProblems[i].score;
          sumB += b.solvedProblems[i].score;

        }
        return sumB - sumA;
      }));
    }
    fetchData();
  }, []);

  return (
    <div>
      <div>{nowContest[0]?.contestName}</div>
      <table>
        <thead>
          <tr>
            <th>등수</th>
            <th>이름</th>
            {nowProblmes.map((problem, index) => (
              <th key={index}>{problem.problemName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contestScores.map((contestScore, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{contestScore.name}</td>
              {contestScore.solvedProblems.sort((a, b) => a.problemId - b.problemId).map((solve) => (
                  <td key={solve.problemId}>{solve.score}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default ScoreBoard;