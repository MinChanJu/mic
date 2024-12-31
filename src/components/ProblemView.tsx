import React, { useRef, useState } from "react";
import { Code, Problem, User } from "../model/talbe";
import { useNavigate, useParams } from "react-router-dom";
import { autoResize } from "../model/commonFunction";
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { serverMessageWithObjectRetry, serverNoReturnRetry } from "../model/serverRetry";
import "./css/ProblemView.css";
import "./css/styles.css";

interface ProblemViewProps {
  user: User
  problems: Problem[]
}

const ProblemView: React.FC<ProblemViewProps> = ({ user, problems }) => {
  const { id } = useParams();
  const problem = problems.filter(problem => problem.id === Number(id));
  const [lang, setLang] = useState<string>('Python');
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  const mathJaxConfig = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],  // 인라인 수식 기호 설정
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],  // 블록 수식 기호 설정
      packages: ["base", "ams"]  // 필요한 패키지들만 로드
    },
    loader: { load: ["[tex]/ams"] },  // AMS 패키지 로드
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(event.target.value);
  };

  const insertKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 4; });
      autoResize(textarea);
    } else if (event.key === '(') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '()' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '{') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '{}' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '[') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '[]' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '"') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '""' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === "'") {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + "''" + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    if (textareaRef.current) {
      autoResize(textareaRef.current);
    }
  };

  const submitCode = async () => {
    setMessage("")
    if (code !== "") {
      let codeDTO: Code = {code: code, lang: lang, problemId: problem[0].id}
      serverMessageWithObjectRetry<string, Code>('code', codeDTO, setMessage, setIsLoading)
    } else {
      setMessage("코드를 작성해주세요")
    }
  }

  const deleteProblem = () => {
    serverNoReturnRetry(`problems/${id}`, null, "delete", "/contest", navigate)
  }

  const goToProblemEdit = () => {
    navigate(`/problem/edit/${id}`)
  }

  return (
    <div className="Problem">
      <div className="prblemName">{problem[0]?.problemName}</div>
      {(user.authority === 5 || user.userId === problem[0]?.userId) &&
        <div className="owner" style={{marginTop: '30px'}}>
          <span className="editButton" onClick={goToProblemEdit}>편집</span>
          <span className="deleteButton" onClick={deleteProblem}>삭제</span>
        </div>
      }
      <MathJaxContext config={mathJaxConfig}>
        <div  style={{ position: 'relative', zIndex: -1 }}>
          <div className="titleDes">
            <div className="desName">문제 설명</div>
            <div className="problemDes"><MathJax>{problem[0]?.problemDescription}</MathJax></div>
          </div>
          <div className="titleDes">
            <div className="desName">입력에 대한 설명</div>
            <div className="problemDes"><MathJax>{problem[0]?.problemInputDescription}</MathJax></div>
          </div>
          <div className="titleDes">
            <div className="desName">출력에 대한 설명</div>
            <div className="problemDes"><MathJax>{problem[0]?.problemOutputDescription}</MathJax></div>
          </div>
        </div>
      </MathJaxContext>
      <div className="doubleDes">
        <div className="titleDes">
          <div className="desName">입력 예제</div>
          <div className="problemDes">{problem[0]?.problemExampleInput}</div>
        </div>
        <div className="titleDes">
          <div className="desName">출력 예제</div>
          <div className="problemDes">{problem[0]?.problemExampleOutput}</div>
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
      <textarea className="codeForm" ref={textareaRef} onInput={handleInput} onKeyDown={insertKey} spellCheck={false} value={code} id="code"></textarea>
      <div className="submitCode" onClick={submitCode}>
        {isLoading ? <div className="loading"></div> : <div>제출</div>}
      </div></>}
    </div>
  )
}

export default ProblemView