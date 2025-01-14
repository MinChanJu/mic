import React, { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { URL, CodeDTO, Problem, Solve, User, mathJaxConfig, ApiResponse } from "../model/talbe"
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import axios, { AxiosError } from "axios"
import "./css/ProblemView.css"
import "./css/styles.css"
import CommonFunction from "../model/CommonFunction"

interface ProblemViewProps {
  user: User
  problems: Problem[]
  solves: Solve[]
  setSolves: React.Dispatch<React.SetStateAction<Solve[]>>;
}

const ProblemView: React.FC<ProblemViewProps> = ({ user, problems, solves, setSolves }) => {
  const { deleteProblem, autoResize, goToProblemEdit } = CommonFunction()
  const { id } = useParams();
  const problem = problems.find(problem => problem.id === Number(id));
  const [lang, setLang] = useState<string>('Python');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const codeRef = useRef<HTMLTextAreaElement | null>(null);

  if (!problem) return <></>

  

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(event.target.value);
  };

  const submitCode = async () => {
    setMessage("")
    if (codeRef.current) {
      if (codeRef.current.value !== "") {
        async function serverMessage() {
          setIsLoading(true);

          const requestData: CodeDTO = {
            code: codeRef.current!.value,
            lang: lang,
            problemId: problem!.id
          };

          try {
            const response = await axios.post<ApiResponse<string>>(URL + 'code', requestData, { timeout: 10000 });
            setMessage(response.data.data);

            let solve: Solve = {
              id: -1,
              userId: user.userId,
              problemId: problem!.id,
              score: 0,
              createdAt: new Date().toISOString()
            };

            const num = Number(response.data.data);
            if (!isNaN(num)) solve.score = Math.floor(num*10);

            await axios.post<ApiResponse<Solve>>(URL + `solves`, solve, { timeout: 10000 });

            const response2 = await axios.post<ApiResponse<Solve[]>>(URL + `solves/${user.userId}`, null, { timeout: 10000 });
            setSolves(response2.data.data);
          } catch (error) {
            if (error instanceof AxiosError) {
              if (error.response) console.error(error.response.data.message);
              else console.error("서버 에러: ", error)
            } else {
              console.error("알 수 없는 에러:", error);
            }
          }

          setIsLoading(false);
        }
        serverMessage();
      } else {
        setMessage("코드를 작성해주세요")
      }
    }
  }

  

  return (
    <div className="Problem">
      <MathJaxContext config={mathJaxConfig}>
      <div className="prblemName"><MathJax>{problem.problemName}</MathJax></div>
      </MathJaxContext>
      {(user.authority === 5 || user.userId === problem.userId) &&
        <div className="owner" style={{ marginTop: '30px' }}>
          <span className="editButton" onClick={() => { goToProblemEdit(problem.id) }}>편집</span>
          <span className="deleteButton" onClick={() => { deleteProblem(problem.id) }}>삭제</span>
        </div>
      }
      {(() => {
        const filtered = solves.filter((solve) => solve.userId === user.userId && solve.problemId === problem.id);

        if (filtered.length === 0) return <></>;

        const score = filtered[0].score;
        let style = { backgroundColor: "rgb(238, 255, 0)" };
        if (score === 1000) style.backgroundColor = "rgb(43, 255, 0)";
        if (score === 0) style.backgroundColor = "rgb(255, 0, 0)";

        return <div className="owner"><div className="solve" style={style}>{score/10}</div></div>;
      })()}
      <MathJaxContext config={mathJaxConfig}>
        <div style={{ position: 'relative', zIndex: -1 }}>
          <div className="titleDes">
            <div className="desName">문제 설명</div>
            <div className="problemDes"><MathJax>{problem.problemDescription}</MathJax></div>
          </div>
          <div className="titleDes">
            <div className="desName">입력에 대한 설명</div>
            <div className="problemDes"><MathJax>{problem.problemInputDescription}</MathJax></div>
          </div>
          <div className="titleDes">
            <div className="desName">출력에 대한 설명</div>
            <div className="problemDes"><MathJax>{problem.problemOutputDescription}</MathJax></div>
          </div>
        </div>
      </MathJaxContext>
      <div className="doubleDes">
        <div className="titleDes">
          <div className="desName">입력 예제</div>
          <div className="problemDes">{problem.problemExampleInput}</div>
        </div>
        <div className="titleDes">
          <div className="desName">출력 예제</div>
          <div className="problemDes">{problem.problemExampleOutput}</div>
        </div>
      </div>
      {user.id === -1 && <div className="resultMessage">코드를 제출하려면 로그인을 해주세요.</div>}
      {user.id !== -1 && <><div className="resultMessage">{message}</div>
        <div className="doubleDes">
          <div className="titleDes">
            <div className="desName">코드</div>
          </div>
          <div className="titleDes left">
            <select className="desName" value={lang} onChange={handleLanguageChange}>
              <option value="Python">Python</option>
              <option value="C">C</option>
              <option value="JAVA">JAVA</option>
            </select>
          </div>
        </div>
        <textarea className="codeForm" ref={codeRef} onInput={autoResize} spellCheck={false} />
        <div className="submitCode" onClick={submitCode}>
          {isLoading ? <div className="loading"></div> : <div>제출</div>}
        </div></>}
    </div>
  )
}

export default ProblemView