/* eslint-disable */
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { URL, Example, InitExample, Problem, ProblemDTO } from "../model/talbe"
import CommonFunction from "../model/CommonFunction"
import axios from "axios"

interface EditProblemProps {
  problems: Problem[]
}

const EditProblem: React.FC<EditProblemProps> = ({ problems }) => {
  const { goToProblemId, autoResize } = CommonFunction();
  const { id } = useParams();
  const problem = problems.find(problem => problem.id === Number(id));
  const [editMessage, setEditMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [exampleInputRefs, setExampleInputRefs] = useState<React.RefObject<HTMLTextAreaElement>[]>([]);
  const [exampleOutputRefs, setExampleOutputRefs] = useState<React.RefObject<HTMLTextAreaElement>[]>([]);
  const problemNameRef = useRef<HTMLInputElement>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement>(null);

  if (!problem) return <></>

  useEffect(() => {
    async function severArray() {
      try {
        const response = await axios.post<Example[]>(URL + `examples/${id}`, null, { timeout: 10000 });
        setExamples(response.data);
        setExampleInputRefs(response.data.map(() => React.createRef<HTMLTextAreaElement>()));
        setExampleOutputRefs(response.data.map(() => React.createRef<HTMLTextAreaElement>()));
      } catch (error) { console.log("서버 오류 " + error) }
    }
    severArray();
  }, []);

  const addExample = () => {
    setExamples((prev) => [...prev, InitExample]);
    setExampleInputRefs((prev) => [...prev, React.createRef<HTMLTextAreaElement>()]);
    setExampleOutputRefs((prev) => [...prev, React.createRef<HTMLTextAreaElement>()]);
  };

  const deleteExample = (index: number) => {
    async function deleteExample() {
      if (examples[index].id != -1) {
        try {
          await axios.delete(URL + `examples/${examples[index].id}`, { timeout: 10000 });
        } catch (error) { console.log("서버 오류 " + error) }
      }
    }
    deleteExample();

    setExamples((prev) => prev.filter((_, idx) => idx != index));
    setExampleInputRefs((prev) => prev.filter((_, idx) => idx != index));
    setExampleOutputRefs((prev) => prev.filter((_, idx) => idx != index));
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

        const exampleData: Example[] = examples.map((example, index) => ({
          id: example.id,
          problemId: problem.id,
          exampleInput: exampleInputRefs[index].current!.value,
          exampleOutput: exampleOutputRefs[index].current!.value,
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
          const response = await axios.put<Problem>(URL + 'problems/update', requestData, { timeout: 10000 });
          const problemR: Problem = response.data

          if (problemR.id == -1) setEditMessage("존재하지 않는 문제")
          else {
            goToProblemId(problemR.id)
            window.location.reload()
          }
        } catch (error) { setEditMessage("서버 오류") }
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
              <textarea className="makeField" ref={exampleInputRefs[index]} defaultValue={example.exampleInput} style={{ minHeight: '100px' }} onInput={autoResize} />
            </div>
            <div className="make-group">
              <div className="makeTitle" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>출력 예제 {index + 1}</span>
                <span style={{ cursor: "pointer" }} onClick={() => { deleteExample(index) }}>예제 삭제</span>
              </div>
              <textarea className="makeField" ref={exampleOutputRefs[index]} defaultValue={example.exampleOutput} style={{ minHeight: '100px' }} onInput={autoResize} />
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