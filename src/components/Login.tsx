import React, { useEffect, useRef, useState } from "react"
import { URL, User } from "../model/talbe"
import axios from "axios"
import './css/Login.css'
import './css/styles.css'
import CommonFunction from "../model/CommonFunction"

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const { goToHome } = CommonFunction()
  const [isMovedLeft, setIsMovedLeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInRef = useRef<HTMLDivElement | null>(null);
  const signInIdRef = useRef<HTMLInputElement | null>(null);
  const signInPasswordRef = useRef<HTMLInputElement | null>(null);
  const [loginMessage, setloginMessage] = useState<string>('');

  const signUpRef = useRef<HTMLDivElement | null>(null);
  const signUpNameRef = useRef<HTMLInputElement | null>(null);
  const signUpIdRef = useRef<HTMLInputElement | null>(null);
  const signUpPasswordRef = useRef<HTMLInputElement | null>(null);
  const signUpCheckPasswordRef = useRef<HTMLInputElement | null>(null);
  const signUpEmailRef = useRef<HTMLInputElement | null>(null);
  const signUpPhoneRef = useRef<HTMLInputElement | null>(null);
  const [registerMessage, setregisterMessage] = useState<string>('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (signInRef.current && signUpRef.current) {
        const signInElement = signInRef.current;
        const signUpElement = signUpRef.current;

        const signInTransformValue = getComputedStyle(signInElement).transform;
        const signUpTransformValue = getComputedStyle(signUpElement).transform;

        const signInMatrixValues = signInTransformValue.match(/matrix.*\((.+)\)/)?.[1].split(', ');
        const signUpMatrixValues = signUpTransformValue.match(/matrix.*\((.+)\)/)?.[1].split(', ');

        if (signInMatrixValues && signUpMatrixValues) {
          const signInTranslateX = parseFloat(signInMatrixValues[4]);
          const signUpTranslateX = parseFloat(signUpMatrixValues[4]);

          const parentWidth = signInElement.parentElement?.offsetWidth || 0;
          const signInPercentageMoved = (signInTranslateX / parentWidth) * 100;
          const signUpPercentageMoved = (signUpTranslateX / parentWidth) * 100;

          if (isMovedLeft) {
            signInElement.style.zIndex = signInPercentageMoved >= 25 ? '1' : '2';
            signUpElement.style.zIndex = signUpPercentageMoved >= 25 ? '2' : '1';
          } else {
            signInElement.style.zIndex = signInPercentageMoved <= 25 ? '2' : '1';
            signUpElement.style.zIndex = signUpPercentageMoved <= 25 ? '1' : '2';
          }

          if ((isMovedLeft && signInPercentageMoved >= 30) || (!isMovedLeft && signInPercentageMoved <= 20)) {
            clearInterval(intervalId);
          }
        }
      }
    }, 50);

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 interval 정리
  }, [isMovedLeft]);

  const handleButtonClick = () => {
    setIsMovedLeft(prev => !prev);
    if (signInIdRef.current &&
      signInPasswordRef.current &&
      signUpNameRef.current &&
      signUpIdRef.current &&
      signUpPasswordRef.current &&
      signUpCheckPasswordRef.current &&
      signUpEmailRef.current &&
      signUpPhoneRef.current) {
      signInIdRef.current.value = ""
      signInPasswordRef.current.value = ""
      signUpNameRef.current.value = ""
      signUpIdRef.current.value = ""
      signUpPasswordRef.current.value = ""
      signUpCheckPasswordRef.current.value = ""
      signUpEmailRef.current.value = ""
      signUpPhoneRef.current.value = ""
    }
  };

  const isPasswordValid = (password: string): string => {
    let message = "\n비밀번호는 8자 이상이어야 하며 영문자, 숫자를 포함해야 합니다."
    if (/\s|'|"|;/.test(password)) { return "비밀번호에 포함되면 안되는 문자가 있습니다." + message }
    if (password.length < 8) { return "비밀번호가 8자 미만입니다." + message }
    if (!/[a-zA-Z]/.test(password)) { return "비밀번호에 영문자가 포함되어 있지 않습니다." + message }
    if (!/[0-9]/.test(password)) { return "비밀번호에 숫자가 포함되어 있지 않습니다." + message }

    return "이미 존재하는 아이디";
  };

  const registerUser = async () => {
    setIsLoading(true)
    if (signUpNameRef.current &&
      signUpIdRef.current &&
      signUpPasswordRef.current &&
      signUpCheckPasswordRef.current &&
      signUpEmailRef.current &&
      signUpPhoneRef.current) {
      if (signUpNameRef.current.value !== "" &&
        signUpIdRef.current.value !== "" &&
        signUpPasswordRef.current.value !== "" &&
        signUpCheckPasswordRef.current.value !== "" &&
        signUpEmailRef.current.value !== "" &&
        signUpPhoneRef.current.value !== "") {
        const password = signUpPasswordRef.current!.value;
        const checkPassword = signUpCheckPasswordRef.current!.value;
        if (password === checkPassword) {
          const requestData: User = {
            id: -1,
            name: signUpNameRef.current.value,
            userId: signUpIdRef.current.value,
            userPw: signUpPasswordRef.current.value,
            phone: signUpPhoneRef.current.value,
            email: signUpEmailRef.current.value,
            authority: 1,
            contest: -1,
            createdAt: new Date().toISOString()
          };

          try {
            const response = await axios.post(URL + `users/create`, requestData, { timeout: 10000 });
            if (response.data === "") {
              setregisterMessage(isPasswordValid(password))
            } else {
              setregisterMessage("회원가입 성공!")
            }
          } catch (error) { console.log("서버 오류 " + error) }
        } else {
          setregisterMessage("비밀번호가 일치하지 않습니다.")
        }
      } else {
        setregisterMessage("빈칸을 채워 넣으세요")
      }
    }
    setIsLoading(false)
  }

  const loginUser = async () => {
    setIsLoading(true)
    if (signInIdRef.current && signInPasswordRef.current) {
      if (signInIdRef.current.value !== "" && signInPasswordRef.current.value !== "") {
        try {
          const response = await axios.post<User>(URL + `users/${signInIdRef.current.value}/${signInPasswordRef.current.value}`, { timeout: 10000 });
          const user: User = response.data
          if (user.id == -1) {
            setloginMessage("잘못된 아이디 또는 비밀번호")
          } else {
            setUser(user)
            sessionStorage.setItem('user', JSON.stringify(user));
            goToHome();
          }
        } catch (error) { console.log("서버 오류 " + error) }
      } else {
        setloginMessage("빈칸을 채워 넣으세요")
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="loginContainer">
      <div className="loginBox" style={{ margin: "auto auto" }}>
        <div ref={signUpRef} id="signUp" className={`signUp`} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>회원가입</h1>
          <span className="message">{registerMessage}</span>
          <div className="input-group">
            <input className="loginField" ref={signUpNameRef} type="text" placeholder="닉네임"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpIdRef} type="text" placeholder="아이디"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpPasswordRef} type="password" placeholder="비밀번호"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpCheckPasswordRef} type="password" placeholder="비밀번호 확인"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpEmailRef} type="text" placeholder="이메일"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpPhoneRef} type="text" placeholder="전화번호"></input>
          </div>
          <button className="loginButton" onClick={registerUser}>
            {isLoading ? <div className="loading"></div> : <div>회원가입</div>}
          </button>
        </div>

        <div id="signInDes" className={`signInDes ${isMovedLeft ? 'move-right' : ''}`}>
          <h1 style={{ color: "white" }}> Hello MiC! </h1>
          <p style={{ color: "white" }}>아이디와 비밀번호를 입력해주세요</p>
          <button className="changeBtn" onClick={handleButtonClick}>회원가입</button>
        </div>

        <div className={`changeBox ${isMovedLeft ? 'move-left' : ''}`}></div>

        <div id="signUpDes" className={`signUpDes ${isMovedLeft ? '' : 'move-left'}`}>
          <h1 style={{ color: "white" }}> Wellcome MiC! </h1>
          <p style={{ color: "white" }}>사용자 정보들을 입력해주세요</p>
          <p style={{ color: "white" }}>비밀번호는 8자 이상이어야 하며</p>
          <p style={{ color: "white" }}>영문자, 숫자를 포함해야합니다.</p>
          <button className="changeBtn" onClick={handleButtonClick}>로그인</button>
        </div>

        <div ref={signInRef} id="signIn" className={`signIn`} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>로그인</h1>
          <span className="message">{loginMessage}</span>
          <div className="input-group">
            <input className="loginField" ref={signInIdRef} type="text" placeholder="아이디"></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signInPasswordRef} type="password" placeholder="비밀번호"></input>
          </div>
          <button className="loginButton" onClick={loginUser}>
            {isLoading ? <div className="loading"></div> : <div>로그인</div>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login