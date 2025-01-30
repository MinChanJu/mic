import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { getScoreBoardByContestId } from '../api/myData'
import { mathJaxConfig } from '../constants/mathJaxConfig'
import { ContestScoreDTO } from '../types/dto/ContestScoreDTO'
import { ProblemListDTO } from '../types/dto/ProblemListDTO'
import Table from '../components/Table'
import { SubmitDTO } from '../types/dto/SubmitDTO'
import ErrorPage from '../components/ErrorPage'
import Loading from '../components/Loading'
import { resultInterval } from '../utils/resultInterval'
import { ScoreBoardDTO } from '../types/dto/ScoreBoardDTO'
import { ContestListDTO } from '../types/dto/ContestListDTO'


const ScoreBoard: React.FC = () => {
  const { contestId } = useParams();
  const [contestScores, setContestScores] = useState<ContestScoreDTO[]>([]);

  const [contest, setContest] = useState<ContestListDTO>();
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([]);
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let requestId = '';

      try {
        const response = await getScoreBoardByContestId(Number(contestId));
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }

      const response = await resultInterval<ScoreBoardDTO>("data", requestId, setError);
      setContest(response.contest);
      setProblemList(response.problemList);
      setContestScores(response.contestScores);

      setLoad(true);
    }

    fetchData();

    const interval = setInterval(fetchData, 15_000);

    return () => clearInterval(interval);
  }, []);

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />
  if (!contest) return <ErrorPage />

  const formatScoreBoard = {
    solveProblems: (value: SubmitDTO[], _: number, col: number) => {
      if (col >= value.length + 2) {
        let sum = 0;
        value.forEach(element => { sum += element.score / 10; });
        return <>{sum}</>
      }

      const score = value[col - 2].score;
      let style: React.CSSProperties = { backgroundColor: "rgb(238, 255, 0)" };
      if (score === 1000) style.backgroundColor = "rgb(43, 255, 0)";
      if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

      return <div style={style}>{score / 10}</div>
    },
  }

  return (
    <div className="list">
      <h2>대회명 : {contest.contestName}</h2>
      <MathJaxContext config={mathJaxConfig}>
        <Table
          columnName={["등수", "이름", ...problemList.map((problem) => problem.problemName), "총점"]}
          columnClass={["num", "center", "center", ...problemList.map(() => "center")]}
          columnFunc={(value: string, col: number) => {
            if (col == 0 || col == 1 || col == problemList.length + 2) return <>{value}</>
            return <MathJax>{value}</MathJax>
          }}
          data={contestScores}
          dataName={["id", "name", ...problemList.map(() => "solveProblems" as keyof ContestScoreDTO), "solveProblems"]}
          dataFunc={formatScoreBoard} />
      </MathJaxContext>
    </div>
  )
}

export default ScoreBoard;