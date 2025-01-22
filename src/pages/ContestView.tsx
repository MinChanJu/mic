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
import { Contest } from "../types/entity/Contest"
import useNavigation from "../hooks/useNavigation"
import Table from "../components/Table"

const ContestView: React.FC = () => {
  const { user } = useUser()
  const { goToContestEdit, goToProblemMake, goToProblemId, goToContestScoreBoard, goToUserId, goToContest } = useNavigation();
  const { contestId } = useParams();
  const [contest, setContest] = useState<Contest>()
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])

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
        const response = await getProblemListByContestIdWithUserId(Number(contestId), user.userId);
        setProblemList(response.data.sort((a, b) => a.id! - b.id!));
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
    <div className='list' style={{ maxWidth: "600px" }}>
      <div className="description text40">{contest.contestName}</div>
      <div className="description text30">{contest.contestDescription}</div>
      <div className="description">주최자 : <span onClick={() => { goToUserId(contest.userId) }}>{contest.userId}</span></div>
      {(user.authority === 5 || user.userId === contest.userId) &&
        <div className="flexRow gap50">
          <span className="button" onClick={() => { goToContestEdit(contest.id!) }}>편집</span>
          <span className="button">참가자 추가</span>
          <span className="button" onClick={() => { deleteContest(contest.id!) }}>삭제</span>
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
          <div className="flexRow">
            <span onClick={() => { goToContestScoreBoard(contest.id!) }} className="button" style={{ marginTop: "10px" }}>스코어보드</span>
          </div>
        )
      })()}
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