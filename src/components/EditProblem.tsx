/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Example, Problem } from "../model/talbe";
import { useNavigate, useParams } from "react-router-dom";
import { url, severArray } from "../model/server";
import { autoResize } from "../model/commonFunction";
import axios from "axios";

interface EditProblemProps {
  problems: Problem[]
}

interface ExampleRef {
  id: number;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  outputRef: React.RefObject<HTMLTextAreaElement>;
}

const EditProblem: React.FC<EditProblemProps> = ({ problems }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = problems.filter(problem => problem.id === Number(id));
  const [editMessage, setEditMessage] = useState<string>('')
  const [examples, setExamples] = useState<Example[]>([]);
  const [exampleRefs, setExampleRefs] = useState<ExampleRef[]>([]);
  const [isRefsInitialized, setIsRefsInitialized] = useState<boolean>(false);
  const problemNameRef = useRef<HTMLInputElement | null>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    severArray( `problems/examples/${id}`, setExamples);
  }, []);

  useEffect(() => {
    if (examples.length > 0) {
      const newRefs = examples.map(({}, index) => ({
        id: Date.now() + index,
        inputRef: React.createRef<HTMLTextAreaElement>(),
        outputRef: React.createRef<HTMLTextAreaElement>(),
      }));
      setExampleRefs(newRefs);
      setIsRefsInitialized(true);
    }
    if (problemNameRef.current &&
      problemDescriptionRef.current &&
      problemInputDescriptionRef.current &&
      problemOutputDescriptionRef.current &&
      problemExampleInputRef.current &&
      problemExampleOutputRef.current) {
      problemNameRef.current.value = problem[0].problemName
      problemDescriptionRef.current.value = problem[0].problemDescription
      problemInputDescriptionRef.current.value = problem[0].problemInputDescription
      problemOutputDescriptionRef.current.value = problem[0].problemOutputDescription
      problemExampleInputRef.current.value = problem[0].problemExampleInput
      problemExampleOutputRef.current.value = problem[0].problemExampleOutput
    }
  }, [examples]);

  useEffect(() => {
    if (isRefsInitialized) {
      exampleRefs.forEach((ref, index) => {
        if (ref.inputRef.current && ref.outputRef.current && examples[index]) {
          ref.inputRef.current.value = examples[index].exampleInput;
          ref.outputRef.current.value = examples[index].exampleOutput;
        }
      });
      setIsRefsInitialized(false);
    }
  }, [isRefsInitialized, exampleRefs, examples]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize(event.target);
  };

  const addExample = () => {
    setExampleRefs(prevExamples => [
      ...prevExamples,
      {
        id: Date.now(),
        inputRef: React.createRef<HTMLTextAreaElement>(),
        outputRef: React.createRef<HTMLTextAreaElement>(),
      }
    ]);
  };

  // 특정 id의 exampleRef를 삭제하는 함수
  const deleteExample = (id: number) => {
    setExampleRefs(prevExamples => prevExamples.filter(exampleRef => exampleRef.id !== id));
  };

  const handleSubmit = async () => {
    if (problemNameRef.current &&
      problemDescriptionRef.current &&
      problemInputDescriptionRef.current &&
      problemOutputDescriptionRef.current &&
      problemExampleInputRef.current &&
      problemExampleOutputRef.current) {
      setEditMessage("")

      if (problemNameRef.current.value !== "" &&
        problemDescriptionRef.current.value !== "" &&
        problemInputDescriptionRef.current.value !== "" &&
        problemOutputDescriptionRef.current.value !== "") {

        const exampleData = exampleRefs.map(exampleRef => ({
          exampleInput: exampleRef.inputRef.current?.value,
          exampleOutput: exampleRef.outputRef.current?.value,
        }));

        const requestData = {
          contestId: problem[0].contestId,
          contestName: problem[0].contestName,
          userId: problem[0].userId,
          problemName: problemNameRef.current.value,
          problemDescription: problemDescriptionRef.current.value,
          problemInputDescription: problemInputDescriptionRef.current.value,
          problemOutputDescription: problemOutputDescriptionRef.current.value,
          problemExampleInput: problemExampleInputRef.current.value,
          problemExampleOutput: problemExampleOutputRef.current.value,
          examples: exampleData
        };
        let attempts = 0;

        while (attempts < 5) {
          try {
            const response = await axios.put(url + `problems/${id}`, requestData, { timeout: 10000 });
            if (response.data === "") {
              setEditMessage("서버 오류")
            } else {
              navigate(`/problem/${id}`)
              window.location.reload()
            }
            break;  // 성공 시 루프 탈출
          } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for contest edit. Error: ${error.message}`);
            if (attempts >= 5) {
              console.error(`All ${5} attempts failed for contest edit.`);
              setEditMessage("이미 존재하는 문제 이름 또는 서버 에러")
              break;
            }
            console.log(`Retrying contest edit in ${1000 / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        setEditMessage("설명을 채워 넣어주세요")
      }
    }
  }

  return (
    <div className="makeContainer">
      <div className="makeBox">
        <h2>문제 정보 기입</h2>
        {problem[0].contestName === "" && <div>대회에 종속되지 않음</div>}
        {problem[0].contestName !== "" && <div>Contest Id: {problem[0].contestId} Contest Name: {problem[0].contestName}</div>}
        <span>{editMessage}</span>
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
        {exampleRefs.map((exampleRef, index) => (
          <div key={exampleRef.id} className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">입력 예제 {index + 1}</div>
              <textarea className="makeField" ref={exampleRef.inputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
            <div className="make-group">
              <div className="makeTitle" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>출력 예제 {index + 1}</span>
                <span style={{ cursor: "pointer" }} onClick={() => { deleteExample(exampleRef.id) }}>예제 삭제</span>
              </div>
              <textarea className="makeField" ref={exampleRef.outputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
          </div>
        ))}
        <div className="addExample" onClick={addExample}>예제 추가</div>
        <div className="makeButton" onClick={handleSubmit}>문제 편집</div>
      </div>
    </div>
  )
}

export default EditProblem