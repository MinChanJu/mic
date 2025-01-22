import React, { useEffect, useState } from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import { AxiosError } from 'axios'
import { getProblemListWithUserId } from '../api/problem'
import { mathJaxConfig } from '../constants/mathJaxConfig'
import { useUser } from '../context/UserContext'
import { formatFunctions } from '../utils/formatter'
import { ProblemListDTO } from '../types/dto/ProblemListDTO'
import useNavigation from '../hooks/useNavigation'
import Table from '../components/Table'

const ProblemList: React.FC = () => {
  const { user } = useUser()
  const { goToProblemMake, goToProblemId } = useNavigation()
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])

  useEffect(() => {
    async function loadProblems() {
      try {
        const response = await getProblemListWithUserId(user.userId);
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
    loadProblems();
  }, []);

  return (
    <div className='list'>
      <h1>문제 목록</h1>
      {user.authority >= 3 && <h3 onClick={() => { goToProblemMake(-1) }}>문제 추가</h3>}
      <MathJaxContext config={mathJaxConfig}>
        <Table
          columnName={["번호", "문제 제목", "대회", "해결"]}
          columnClass={["num", "", "", "solveHead"]}
          data={problemList}
          dataName={["problemId", "problemName", "contestName", "score"]}
          dataFunc={formatFunctions}
          onClick={(item) => goToProblemId(item.problemId)} />
      </MathJaxContext>
    </div>
  );
}

export default ProblemList;
