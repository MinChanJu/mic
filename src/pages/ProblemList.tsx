import React, { useEffect, useState } from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import { getProblemListWithUserId } from '../api/problem'
import { mathJaxConfig } from '../constants/mathJaxConfig'
import { useUser } from '../context/UserContext'
import { formatFunctions } from '../utils/formatter'
import { ProblemListDTO } from '../types/dto/ProblemListDTO'
import useNavigation from '../hooks/useNavigation'
import Table from '../components/Table'
import Loading from '../components/Loading'
import ErrorPage from '../components/ErrorPage'
import { resultInterval } from '../utils/resultInterval'

const ProblemList: React.FC = () => {
  const { user } = useUser()
  const { goToProblemMake, goToProblemId } = useNavigation()
  const [problemList, setProblemList] = useState<ProblemListDTO[]>([])
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      let requestId = ''
      try {
        const response = await getProblemListWithUserId(user.userId);
        requestId = response.data;
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }

      resultInterval<ProblemListDTO[]>("problems", requestId, 500, setError, setLoad, setProblemList)
    }
    loadProblems();
  }, []);

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />

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
      {problemList.length === 0 && <div>문제가 존재하지 않습니다.</div>}
    </div>
  );
}

export default ProblemList;
