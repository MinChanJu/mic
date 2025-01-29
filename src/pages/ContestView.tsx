import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MathJaxContext } from "better-react-mathjax"
import { AxiosError } from "axios"
import { deleteContestById, getContestById } from "../api/contest"
import { getProblemListByContestIdWithUserId } from "../api/problem"
import { mathJaxConfig } from "../constants/mathJaxConfig"
import { useUser } from "../context/UserContext"
import { formatFunctions } from "../utils/formatter"
import { ProblemListDTO } from "../types/dto/ProblemListDTO"
import useNavigation from "../hooks/useNavigation"
import Table from "../components/Table"
import ErrorPage from "../components/ErrorPage"
import Loading from "../components/Loading"
import { resultInterval } from "../utils/resultInterval"
import { ContestListDTO } from "../types/dto/ContestListDTO"

const ContestView: React.FC = () => {
  const { user } = useUser()
  const { goToContestEdit, goToProblemMake, goToProblemId, goToContestScoreBoard, goToContestManage, goToUserId, goToContest } = useNavigation();
  const { contestId } = useParams();
  const [contest, setContest] = useState<ContestListDTO>()
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setError(false)
    async function loadContestAndProblems() {
      let requestId1 = ''
      let requestId2 = ''

      try {
        const response = await getContestById(Number(contestId));
        requestId1 = response.data;
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }

      try {
        const response = await getProblemListByContestIdWithUserId(Number(contestId), user.userId);
        requestId2 = response.data;
      } catch (error) {
        console.error("에러:", error);
        setError(true);
      }

      const response1 = await resultInterval<ContestListDTO[]>("contests", requestId1, 500, setError);
      const response2 = await resultInterval<ProblemListDTO[]>("problems", requestId2, 500, setError, setLoad);
      setContest(response1.pop())
      setProblemList(response2)
    }

    loadContestAndProblems();
  }, [contestId]);

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />
  if (!contest) return <ErrorPage />


  if (contest.startTime != null && new Date(contest.startTime) >= new Date() && user.authority != 5 && user.userId !== contest.userId) return (<div>아직 아님</div>)

  const deleteContest = async (contestId: number) => {
    try {
      await deleteContestById(contestId);
      goToContest();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) console.error("응답 에러: ", error.response.data.message);
        else console.error("서버 에러: ", error)
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  const scoreBoard = () => {
    const now = new Date();
    if (contest.startTime == null) return <></>
    if (contest.endTime == null) return <></>

    const event = new Date(contest.startTime);
    const finish = new Date(contest.endTime);

    if (now < event || finish <= now) return <></>

    return (
      <div className="flexRow">
        <span onClick={() => { goToContestScoreBoard(contest.id!) }} className="button" style={{ marginTop: "10px" }}>스코어보드</span>
      </div>
    )
  }

  return (
    <div className='list' style={{ maxWidth: "600px" }}>
      <div className="description text40">{contest.contestName}</div>
      <div className="description text30">{contest.contestDescription}</div>
      <div className="description">주최자 : <span onClick={() => { goToUserId(contest.userId) }}>{contest.userId}</span></div>
      {(user.authority === 5 || user.userId === contest.userId) &&
        <div className="flexRow gap50">
          <span className="button" onClick={() => { goToContestEdit(contest.id!) }}>편집</span>
          <span className="button" onClick={() => { goToContestManage(contest.id!) }}>참가자 관리</span>
          <span className="button" onClick={() => { deleteContest(contest.id!) }}>삭제</span>
        </div>
      }
      {scoreBoard()}
      <MathJaxContext config={mathJaxConfig}>
        <Table
          columnName={["번호", "문제 제목", "해결"]}
          columnClass={["num", "", "solveHead"]}
          data={problemList}
          dataName={["id", "problemName", "score"]}
          dataFunc={formatFunctions}
          onClick={(item) => goToProblemId(item.problemId)} />
      </MathJaxContext>
      {(user.authority === 5 || user.userId === contest?.userId) &&
        <div className="flexRow">
          <span className="button" onClick={() => { goToProblemMake(contest.id!) }}>문제 추가</span>
        </div>
      }
    </div>
  )
}

export default ContestView