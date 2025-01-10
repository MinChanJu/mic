import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentContest, User } from "../model/talbe";
import { autoResize } from "../model/commonFunction";
import axios from "axios";
import "./css/ProblemMake.css"
import "./css/styles.css"
import { url } from "../model/server";

interface ProblemMakeProps {
  currentContest: CurrentContest
  user: User
}

interface ExampleRef {
  id: number;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  outputRef: React.RefObject<HTMLTextAreaElement>;
}

const ProblemMake: React.FC<ProblemMakeProps> = ({ currentContest, user }) => {
  const navigate = useNavigate();
  const [makeMessage, setMakeMessage] = useState<string>('')
  const [examples, setExamples] = useState<ExampleRef[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const problemNameRef = useRef<HTMLInputElement | null>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement | null>(null);
  const refs = [
    problemNameRef,
    problemDescriptionRef,
    problemInputDescriptionRef,
    problemOutputDescriptionRef,
    problemExampleInputRef,
    problemExampleOutputRef
  ];

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize(event.target);
  };

  const addExample = () => {
    setExamples(prevExamples => [
      ...prevExamples,
      {
        id: Date.now(),
        inputRef: React.createRef<HTMLTextAreaElement>(),
        outputRef: React.createRef<HTMLTextAreaElement>(),
      }
    ]);
  };

  const deleteExample = (id: number) => {
    setExamples(prevExamples => prevExamples.filter(exampleRef => exampleRef.id !== id));
  };

  const handleSubmit = async (cont: number) => {
    setIsLoading(true)
    if (problemNameRef.current &&
      problemDescriptionRef.current &&
      problemInputDescriptionRef.current &&
      problemOutputDescriptionRef.current &&
      problemExampleInputRef.current &&
      problemExampleOutputRef.current) {
      setMakeMessage("")

      if (problemNameRef.current.value !== "" &&
        problemDescriptionRef.current.value !== "" &&
        problemInputDescriptionRef.current.value !== "" &&
        problemOutputDescriptionRef.current.value !== "") {

        const exampleData = examples.map(example => ({
          exampleInput: example.inputRef.current?.value,
          exampleOutput: example.outputRef.current?.value,
        }));

        const requestData = {
          contestId: currentContest.contestId,
          contestName: currentContest.contestName,
          userId: user.userId,
          problemName: problemNameRef.current.value,
          problemDescription: problemDescriptionRef.current.value,
          problemInputDescription: problemInputDescriptionRef.current.value,
          problemOutputDescription: problemOutputDescriptionRef.current.value,
          problemExampleInput: problemExampleInputRef.current.value,
          problemExampleOutput: problemExampleOutputRef.current.value,
          examples: exampleData
        };

        const response = await axios.post(url + `problems/create`, requestData, { timeout: 10000 });

        if (response.data === "") {
          setMakeMessage("서버 오류")
        } else {
          if (cont === 1) {
            setExamples([])
            refs.forEach(ref => {
              if (ref.current) {
                ref.current.value = "";
              }
            });
          } else {
            navigate(`/home`)
            window.location.reload()
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
          {currentContest.contestName === "" && <div>대회에 종속되지 않음</div>}
          {currentContest.contestName !== "" && <div>Contest Id: {currentContest.contestId} Contest Name: {currentContest.contestName}</div>}
          <div className="make-group">
            <div className="makeTitle">문제 제목</div>
            <input className="makeField" ref={problemNameRef} type="text"></input>
          </div>
          <div className="make-group">
            <div className="makeTitle">문제 설명</div>
            <textarea className="makeField" ref={problemDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="make-group">
            <div className="makeTitle">입력에 대한 설명</div>
            <textarea className="makeField" ref={problemInputDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="make-group">
            <div className="makeTitle">출력에 대한 설명</div>
            <textarea className="makeField" ref={problemOutputDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">입력 예제</div>
              <textarea className="makeField" ref={problemExampleInputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
            <div className="make-group">
              <div className="makeTitle">출력 예제</div>
              <textarea className="makeField" ref={problemExampleOutputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
          </div>
          {examples.map((example, index) => (
            <div key={example.id} className="double-make-group">
              <div className="make-group">
                <div className="makeTitle">입력 예제 {index + 1}</div>
                <textarea className="makeField" ref={example.inputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
              </div>
              <div className="make-group">
                <div className="makeTitle" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>출력 예제 {index + 1}</span>
                  <span style={{ cursor: "pointer" }} onClick={() => { deleteExample(example.id) }}>예제 삭제</span>
                </div>
                <textarea className="makeField" ref={example.outputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
              </div>
            </div>
          ))}
          <div className="addExample" onClick={addExample}>예제 추가</div>
          <span className="message">{makeMessage}</span>
          <div className="double-make-group">
            {currentContest.contestName !== "" &&
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