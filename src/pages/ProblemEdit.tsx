import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AxiosError } from "axios"
import { getProblemById, updateProblem } from "../api/problem"
import { deleteExampleById, getAllExamplesByProblemId } from "../api/example"
import { ProblemDTO } from "../types/dto/ProblemDTO"
import { Problem } from "../types/entity/Problem"
import { Example, InitExample } from "../types/entity/Example"
import { resultInterval } from "../utils/resultInterval"
import { autoResize } from "../utils/resize"
import useNavigation from "../hooks/useNavigation"
import ErrorPage from "../components/ErrorPage"
import Loading from "../components/Loading"

const EditProblem: React.FC = () => {
  const { problemId } = useParams();
  const { goToProblemId } = useNavigation();
  const [problem, setProblem] = useState<Problem>()
  const [editMessage, setEditMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function loadProblem() {
      let requestId1 = ''
      let requestId2 = ''

      try {
        const response1 = await getProblemById(Number(problemId));
        const response2 = await getAllExamplesByProblemId(Number(problemId));
        requestId1 = response1.data;
        requestId2 = response2.data;
      } catch (error) {
        console.error("에러: ", error);
        setError(true)
      }

      await resultInterval<Problem>("problems", requestId1, setError, undefined, setProblem);
      await resultInterval<Example[]>("problems", requestId2, setError, setLoad, setExamples);
    }

    loadProblem();
  }, []);

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />
  if (!problem) return <ErrorPage />

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
    if (problem.problemName !== "" &&
      problem.problemDescription !== "" &&
      problem.problemInputDescription !== "" &&
      problem.problemOutputDescription !== "") {

      const exampleData: Example[] = examples.map((example) => ({
        id: example.id,
        problemId: problem.id!,
        userId: problem.userId,
        exampleInput: example.exampleInput,
        exampleOutput: example.exampleOutput,
        createdAt: example.createdAt
      }));

      const requestData: ProblemDTO = {
        problem: problem,
        examples: exampleData
      };

      let requestId = '';

      try {
        const response = await updateProblem(requestData);
        requestId = response.data;
      } catch (error) {
        setEditMessage("오류");
        console.error("알 수 없는 에러:", error);
      }

      try {
        const response = await resultInterval<Problem>("problems", requestId)
        goToProblemId(response.id!)
      } catch (error) {
        setEditMessage("오류");
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
    setIsLoading(false)
  }

  return (
    <div className="makeContainer">
      <div className="makeBox">
        <h2>문제 정보 기입</h2>
        {problem.contestId == -1 && <div>대회에 종속되지 않음</div>}
        {problem.contestId !== -1 && <div>Contest Id: {problem.contestId} Contest Name: {problem.contestId}</div>}
        <div className="makeGroup">
          <div className="makeTitle">문제 제목</div>
          <input className="makeField" value={problem.problemName} onChange={(e) => setProblem({ ...problem, "problemName": e.target.value || "" })} type="text" />
        </div>
        <div className="makeGroup">
          <div className="makeTitle">문제 설명</div>
          <textarea className="makeField" value={problem.problemDescription} onChange={(e) => setProblem({ ...problem, "problemDescription": e.target.value || "" })} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="makeGroup">
          <div className="makeTitle">입력에 대한 설명</div>
          <textarea className="makeField" value={problem.problemInputDescription} onChange={(e) => setProblem({ ...problem, "problemInputDescription": e.target.value || "" })} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="makeGroup">
          <div className="makeTitle">출력에 대한 설명</div>
          <textarea className="makeField" value={problem.problemOutputDescription} onChange={(e) => setProblem({ ...problem, "problemOutputDescription": e.target.value || "" })} style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <div className="doubleMakeGroup">
          <div className="makeGroup">
            <div className="makeTitle">입력 예제</div>
            <textarea className="makeField" value={problem.problemExampleInput} onChange={(e) => setProblem({ ...problem, "problemExampleInput": e.target.value || "" })} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
          <div className="makeGroup">
            <div className="makeTitle">출력 예제</div>
            <textarea className="makeField" value={problem.problemExampleOutput} onChange={(e) => setProblem({ ...problem, "problemExampleOutput": e.target.value || "" })} style={{ minHeight: '100px' }} onInput={autoResize} />
          </div>
        </div>
        {examples.map((example, index) => (
          <div key={index} className="doubleMakeGroup">
            <div className="makeGroup">
              <div className="makeTitle">입력 예제 {index + 1}</div>
              <textarea className="makeField" value={example.exampleInput}
                onChange={(e) => handleExampleChange(index, "exampleInput", e.target.value)}
                style={{ minHeight: '100px' }} onInput={autoResize} />
            </div>
            <div className="makeGroup">
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
        <span className="red">{editMessage}</span>
        <div className="makeButton" onClick={handleSubmit}>
          {isLoading ? <Loading /> : <>문제 편집</>}
        </div>
      </div>
    </div>
  )
}

export default EditProblem