import React, { useEffect, useState } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { AxiosError } from 'axios'
import { getAllProblems } from '../api/problem'
import { mathJaxConfig } from '../constants/mathJaxConfig'
import { useUser } from '../context/UserContext'
import { Problem } from '../types/Problem'
import useNavigation from '../hooks/useNavigation'
import '../styles/List.css'

const ProblemList: React.FC = () => {
  const { user, solves} = useUser()
  const { goToProblemMake, goToProblemId } = useNavigation()
  const [ problems, setProblems] = useState<Problem[]>([])

  useEffect(() => {
    async function loadProblems() {
      try {
        const response = await getAllProblems();
        setProblems(response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
    <div className="list-container">
      <div className='list'>
        <h1>문제 목록</h1>
        {user.authority >= 3 && <h3 onClick={() => { goToProblemMake(-1) }}>문제 추가</h3>}
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>문제 제목</th>
              <th>대회</th>
              <th>해결</th>
            </tr>
          </thead>
          <tbody>
          <MathJaxContext config={mathJaxConfig}>
            {problems.map((problem, index) => (
              <tr className='element' onClick={() => { goToProblemId(problem.id!) }} key={problem.id}>
                <td>{index + 1}</td>
                <td><MathJax>{problem.id}. {problem.problemName}</MathJax></td>
                <td>{problem.contestId}</td>
                <td>
                  {(() => {
                    const filtered = solves.filter((solve) => solve.userId === user.userId && solve.problemId === problem.id);

                    if (filtered.length === 0) return <></>;

                    const score = filtered[0].score;
                    let style = { backgroundColor: "rgb(238, 255, 0)" };
                    if (score === 1000) style.backgroundColor = "rgb(43, 255, 0)";
                    if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

                    return <div className="solve" style={style}>{score/10}</div>;
                  })()}
                </td>
              </tr>
            ))}
            </MathJaxContext>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemList;
