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
import Table from '../components/Table'
import { SubmitDTO } from '../types/dto/SubmitDTO'
import ErrorPage from '../components/ErrorPage'
import Loading from '../components/Loading'


const ScoreBoard: React.FC = () => {
  const { contestId } = useParams();
  const [contestScores, setContestScores] = useState<ContestScoreDTO[]>([]);

  const [contest, setContest] = useState<Contest>();
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([]);
  const [error, setError] = useState(false);

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
        setError(true);
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
        setError(true);
      }
    }
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
        setError(true);
      }
    }
    loadContest();
    loadProblems();
    fetchData();

    const interval = setInterval(fetchData, 15_000);

    return () => clearInterval(interval);
  }, []);

  if (error) return <ErrorPage />
  if (!contest) return <Loading width={60} border={6} />

  const formatScoreBoard = {
    name: (value: string, row: number, col: number) => {
      if (col == 0) return <>{row + 1}</>
      return <>{value}</>
    },
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
          dataName={["name", "name", ...problemList.map(() => "solveProblems" as keyof ContestScoreDTO), "solveProblems"]}
          dataFunc={formatScoreBoard} />
      </MathJaxContext>
    </div>
  )
}

export default ScoreBoard;