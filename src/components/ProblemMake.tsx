import React, { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { URL, Example, Problem, ProblemDTO, User } from "../model/talbe"
import axios from "axios"
import "./css/ProblemMake.css"
import "./css/styles.css"
import CommonFunction from "../model/CommonFunction"

interface ProblemMakeProps {
  user: User
}

const ProblemMake: React.FC<ProblemMakeProps> = ({ user }) => {
  const { autoResize, goToHome } = CommonFunction()
  const { id } = useParams();
  const [makeMessage, setMakeMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exampleInputRefs, setExampleInputRefs] = useState<React.RefObject<HTMLTextAreaElement>[]>([]);
  const [exampleOutputRefs, setExampleOutputRefs] = useState<React.RefObject<HTMLTextAreaElement>[]>([]);
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
    setExampleInputRefs((prev) => [...prev, React.createRef<HTMLTextAreaElement>()]);
    setExampleOutputRefs((prev) => [...prev, React.createRef<HTMLTextAreaElement>()]);
  };

  const deleteExample = (index: number) => {
    setExampleInputRefs((prev) => prev.filter((_, idx) => idx != index));
    setExampleOutputRefs((prev) => prev.filter((_, idx) => idx != index));
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

        const exampleData: Example[] = exampleInputRefs.map((_, index) => ({
          id: -1,
          problemId: -1,
          exampleInput: exampleInputRefs[index].current!.value,
          exampleOutput: exampleOutputRefs[index].current!.value,
          createdAt: new Date().toISOString()
        }));

        const problemData: Problem = {
          id: -1,
          contestId: Number(id),
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
          const response = await axios.post<Problem>(URL + `problems/create`, requestData, { timeout: 10000 });
          const problemR: Problem = response.data;

          if (problemR.id == -1) setMakeMessage("서버 오류")
          else {
            if (cont === 1) {
              setExampleInputRefs([])
              setExampleOutputRefs([])
              refs.forEach(ref => {if (ref.current) ref.current.value = "";});
            } else {
              goToHome()
              window.location.reload()
            }
          }
        } catch (error) { setMakeMessage("서버 오류") }
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
          {Number(id) === -1 && <div>대회에 종속되지 않음</div>}
          {Number(id) !== -1 && <div>Contest Id: {Number(id)} Contest Name: {Number(id)}</div>}
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
          {exampleInputRefs.map((_, index) => (
            <div key={index} className="double-make-group">
              <div className="make-group">
                <div className="makeTitle">입력 예제 {index + 1}</div>
                <textarea className="makeField" ref={exampleInputRefs[index]} style={{ minHeight: '100px' }} onInput={autoResize} />
              </div>
              <div className="make-group">
                <div className="makeTitle" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>출력 예제 {index + 1}</span>
                  <span style={{ cursor: "pointer" }} onClick={() => { deleteExample(index) }}>예제 삭제</span>
                </div>
                <textarea className="makeField" ref={exampleOutputRefs[index]} style={{ minHeight: '100px' }} onInput={autoResize} />
              </div>
            </div>
          ))}
          <div className="addExample" onClick={addExample}>예제 추가</div>
          <span className="message">{makeMessage}</span>
          <div className="double-make-group">
            {Number(id) !== -1 &&
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