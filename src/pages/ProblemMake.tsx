import React, { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { createProblem } from "../api/problem"
import { useUser } from "../context/UserContext"
import { Problem } from "../types/Problem"
import { ProblemDTO } from "../types/ProblemDTO"
import { Example, InitExample } from "../types/Example"
import { autoResize } from "../utils/resize"
import useNavigation from "../hooks/useNavigation"
import "../styles/ProblemMake.css"
import "../styles/styles.css"

const ProblemMake: React.FC = () => {
  const {user} = useUser()
  const { goToHome } = useNavigation()
  const { contestId } = useParams();
  const [makeMessage, setMakeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const problemNameRef = useRef<HTMLInputElement>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement>(null);
  const refs = [
    problemNameRef,
    problemDescriptionRef,
    problemInputDescriptionRef,
    problemOutputDescriptionRef,
    problemExampleInputRef,
    problemExampleOutputRef
  ];

  const addExample = () => {
    setExamples((prev) => [...prev, InitExample]);
  };

  const deleteExample = (index: number) => {
    setExamples((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const handleExampleChange = (index: number, field: "exampleInput" | "exampleOutput", value: string) => {
    setExamples((prev) =>
      prev.map((example, idx) =>
        idx === index ? { ...example, [field]: value } : example
      )
    );
  };

  const handleSubmit = async (cont: number) => {
    setIsLoading(true)
    setMakeMessage("")
    if (problemNameRef.current &&
      problemDescriptionRef.current &&
      problemInputDescriptionRef.current &&
      problemOutputDescriptionRef.current &&
      problemExampleInputRef.current &&
      problemExampleOutputRef.current) {
      if (problemNameRef.current.value !== "" &&
        problemDescriptionRef.current.value !== "" &&
        problemInputDescriptionRef.current.value !== "" &&
        problemOutputDescriptionRef.current.value !== "") {

        const exampleData: Example[] = examples.map((example) => ({
          id: null,
          problemId: -1,
          exampleInput: example.exampleInput,
          exampleOutput: example.exampleOutput,
          createdAt: new Date().toISOString()
        }));

        const problemData: Problem = {
          id: null,
          contestId: Number(contestId),
          userId: user.userId,
          problemName: problemNameRef.current.value,
          problemDescription: problemDescriptionRef.current.value,
          problemInputDescription: problemInputDescriptionRef.current.value,
          problemOutputDescription: problemOutputDescriptionRef.current.value,
          problemExampleInput: problemExampleInputRef.current.value,
          problemExampleOutput: problemExampleOutputRef.current.value,
          createdAt: new Date().toISOString()
        };

        const requestData: ProblemDTO = {
          problem: problemData,
          examples: exampleData
        };

        try {
          await createProblem(requestData)
          if (cont === 1) {
            setExamples([])
            refs.forEach(ref => {if (ref.current) ref.current.value = "";});
          } else {
            goToHome()
            window.location.reload()
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) setMakeMessage("응답 에러: " + error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
        }
      } else {
        setMakeMessage("설명을 채워 넣어주세요")
      }
    }
    setIsLoading(false)
  };

  return (
    <div className="makeContainer">
      {user.authority < 3 &&
        <div className="makeBox">
          <h2>권한 없음</h2>
        </div>
      }
      {user.authority >= 3 &&
        <div className="makeBox">
          <h2>문제 정보 기입</h2>
          {Number(contestId) === -1 && <div>대회에 종속되지 않음</div>}
          {Number(contestId) !== -1 && <div>Contest Id: {Number(contestId)} Contest Name: {Number(contestId)}</div>}
          <div className="make-group">
            <div className="makeTitle">문제 제목</div>
            <input className="makeField" ref={problemNameRef} type="text" />
          </div>
          <div className="make-group">
            <div className="makeTitle">문제 설명</div>
            <textarea className="makeField" ref={problemDescriptionRef} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
          <div className="make-group">
            <div className="makeTitle">입력에 대한 설명</div>
            <textarea className="makeField" ref={problemInputDescriptionRef} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
          <div className="make-group">
            <div className="makeTitle">출력에 대한 설명</div>
            <textarea className="makeField" ref={problemOutputDescriptionRef} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">입력 예제</div>
              <textarea className="makeField" ref={problemExampleInputRef} style={{ minHeight: '100px' }} onInput={autoResize} />
            </div>
            <div className="make-group">
              <div className="makeTitle">출력 예제</div>
              <textarea className="makeField" ref={problemExampleOutputRef} style={{ minHeight: '100px' }} onInput={autoResize} />
            </div>
          </div>
          {examples.map((example, index) => (
            <div key={index} className="double-make-group">
              <div className="make-group">
                <div className="makeTitle">입력 예제 {index + 1}</div>
                <textarea className="makeField" value={example.exampleInput}
                onChange={(e) => handleExampleChange(index, "exampleInput", e.target.value)}
                style={{ minHeight: '100px' }} onInput={autoResize} />
              </div>
              <div className="make-group">
                <div className="makeTitle" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>출력 예제 {index + 1}</span>
                  <span style={{ cursor: "pointer" }} onClick={() => { deleteExample(index) }}>예제 삭제</span>
                </div>
                <textarea className="makeField" value={example.exampleOutput}
                onChange={(e) => handleExampleChange(index, "exampleOutput", e.target.value)}
                style={{ minHeight: '100px' }} onInput={autoResize} />
              </div>
            </div>
          ))}
          <div className="addExample" onClick={addExample}>예제 추가</div>
          <span className="message">{makeMessage}</span>
          <div className="double-make-group">
            {Number(contestId) !== -1 &&
              <div className="makeButton" onClick={() => { handleSubmit(1) }}>
                {isLoading ? <div className="loading"></div> : <div>문제 추가</div>}
              </div>
            }
            <div className="makeButton" onClick={() => { handleSubmit(0) }}>
              {isLoading ? <div className="loading"></div> : <div>문제 완성</div>}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default ProblemMake