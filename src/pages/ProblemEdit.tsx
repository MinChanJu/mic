/* eslint-disable */
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { getProblemById, updateProblem } from "../api/problem"
import { deleteExampleById, getAllExamplesByProblemId } from "../api/example"
import { autoResize } from "../utils/resize"
import { Problem } from "../types/entity/Problem"
import { Example, InitExample } from "../types/entity/Example"
import { ProblemDTO } from "../types/dto/ProblemDTO"
import useNavigation from "../hooks/useNavigation"

const EditProblem: React.FC = () => {
  const { problemId } = useParams();
  const { goToProblemId } = useNavigation();
  const [problem, setProblem] = useState<Problem>()
  const [editMessage, setEditMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const problemNameRef = useRef<HTMLInputElement>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadProblem() {
      try {
        const response = await getProblemById(Number(problemId));
        setProblem(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    async function loadExamples() {
      try {
        const response = await getAllExamplesByProblemId(Number(problemId));
        setExamples(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    loadProblem();
    loadExamples();
  }, []);

  if (!problem) return <></>

  const addExample = () => {
    setExamples((prev) => [...prev, InitExample]);
  };

  const deleteExample = async (index: number) => {
    if (examples[index].id != null) {
      try {
        await deleteExampleById(examples[index].id);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error)
        } else {
          console.error("알 수 없는 에러:", error);
        }
      }
    }
    setExamples((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const handleExampleChange = (index: number, field: "exampleInput" | "exampleOutput", value: string) => {
    setExamples((prev) =>
      prev.map((example, idx) =>
        idx === index ? { ...example, [field]: value } : example
      )
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    setEditMessage("")
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
          id: example.id,
          problemId: problem.id!,
          exampleInput: example.exampleInput,
          exampleOutput: example.exampleOutput,
          createdAt: example.createdAt
        }));

        const problemData: Problem = {
          id: problem.id,
          contestId: problem.contestId,
          userId: problem.userId,
          problemName: problemNameRef.current.value,
          problemDescription: problemDescriptionRef.current.value,
          problemInputDescription: problemInputDescriptionRef.current.value,
          problemOutputDescription: problemOutputDescriptionRef.current.value,
          problemExampleInput: problemExampleInputRef.current.value,
          problemExampleOutput: problemExampleOutputRef.current.value,
          createdAt: problem.createdAt
        };

        const requestData: ProblemDTO = {
          problem: problemData,
          examples: exampleData
        };

        try {
          const response = await updateProblem(requestData);

          goToProblemId(response.data.id!)
          window.location.reload()
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) setEditMessage("응답 에러: " + error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
        }
      } else {
        setEditMessage("설명을 채워 넣어주세요")
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="makeContainer">
      <div className="makeBox">
        <h2>문제 정보 기입</h2>
        {problem.contestId == -1 && <div>대회에 종속되지 않음</div>}
        {problem.contestId !== -1 && <div>Contest Id: {problem.contestId} Contest Name: {problem.contestId}</div>}
        <span>{editMessage}</span>
        <div className="make-group">
          <div className="makeTitle">문제 제목</div>
          <input className="makeField" ref={problemNameRef} defaultValue={problem.problemName} type="text" />
        </div>
        <div className="make-group">
          <div className="makeTitle">문제 설명</div>
          <textarea className="makeField" ref={problemDescriptionRef} defaultValue={problem.problemDescription} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="make-group">
          <div className="makeTitle">입력에 대한 설명</div>
          <textarea className="makeField" ref={problemInputDescriptionRef} defaultValue={problem.problemInputDescription} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="make-group">
          <div className="makeTitle">출력에 대한 설명</div>
          <textarea className="makeField" ref={problemOutputDescriptionRef} defaultValue={problem.problemOutputDescription} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="double-make-group">
          <div className="make-group">
            <div className="makeTitle">입력 예제</div>
            <textarea className="makeField" ref={problemExampleInputRef} defaultValue={problem.problemExampleInput} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
          <div className="make-group">
            <div className="makeTitle">출력 예제</div>
            <textarea className="makeField" ref={problemExampleOutputRef} defaultValue={problem.problemExampleOutput} style={{ minHeight: '100px' }} onInput={autoResize} />
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
        <div className="makeButton" onClick={handleSubmit}>{isLoading ? <div className="loading"></div> : <>문제 편집</>}</div>
      </div>
    </div>
  )
}

export default EditProblem