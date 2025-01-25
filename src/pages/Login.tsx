import React, { useEffect, useRef, useState } from "react"
import { AxiosError } from "axios"
import { login, register } from "../api/user"
import { useUser } from "../context/UserContext"
import { User } from "../types/entity/User"
import useNavigation from "../hooks/useNavigation"
import styles from "../assets/css/Login.module.css"
import { UserLoginDTO } from "../types/dto/UserLoginDTO"

const Login: React.FC = () => {
  const {setUser} = useUser();
  const { goToHome } = useNavigation()
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
            id: null,
            name: signUpNameRef.current.value,
            userId: signUpIdRef.current.value,
            userPw: signUpPasswordRef.current.value,
            phone: signUpPhoneRef.current.value,
            email: signUpEmailRef.current.value,
            authority: 1,
            contestId: -1,
            createdAt: new Date().toISOString()
          };

          try {
            await register(requestData);
            setregisterMessage("회원가입 성공!")
            handleButtonClick()
          } catch (error) {
            if (error instanceof AxiosError) {
              if (error.response) {
                setregisterMessage(error.response.data.message + "\n비밀번호는 영문자, 숫자를 포함해야하며 8자 이상이어야 합니다.");
                console.error("응답 에러: ", error.response.data.message)
              }
              else {
                setregisterMessage("서버 에러")
                console.error("서버 에러:", error);
              }
            } else {
              console.error("알 수 없는 에러:", error);
            }
          }
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
    setloginMessage("")
    if (signInIdRef.current && signInPasswordRef.current) {
      if (signInIdRef.current.value !== "" && signInPasswordRef.current.value !== "") {
        try {
          const requestData: UserLoginDTO = {
            userId: signInIdRef.current.value,
            userPw: signInPasswordRef.current.value
          }
          const response = await login(requestData);
          setUser(response.data.user)
          sessionStorage.setItem('token', response.data.token);
          goToHome();
          window.location.reload()
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) setloginMessage("응답 에러: " + error.response.data.message);
            else setloginMessage("서버 에러: " + error)
          } else {
            setloginMessage("알 수 없는 에러: " + error);
          }
        }
      } else {
        setloginMessage("빈칸을 채워 넣으세요")
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="flexRow" style={{ margin: "50px auto" }}>
      <div className={styles.loginBox} style={{ margin: "auto auto" }}>
        <div ref={signUpRef} className={styles.signUp} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>회원가입</h1>
          <span className="red">{registerMessage}</span>
          <div className="makeGroup">
            <input className="makeField" ref={signUpNameRef} type="text" placeholder="닉네임"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signUpIdRef} type="text" placeholder="아이디"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signUpPasswordRef} type="password" placeholder="비밀번호"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signUpCheckPasswordRef} type="password" placeholder="비밀번호 확인"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signUpEmailRef} type="text" placeholder="이메일"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signUpPhoneRef} type="text" placeholder="전화번호"></input>
          </div>
          <button className="makeButton" onClick={registerUser}>
            {isLoading ? <div className="loading"></div> : <div>회원가입</div>}
          </button>
        </div>

        <div className={`${styles.signInDes} ${isMovedLeft ? styles.moveRight : ''}`}>
          <h1 style={{ color: "white" }}> Hello MiC! </h1>
          <p style={{ color: "white" }}>아이디와 비밀번호를 입력해주세요</p>
          <button className={styles.changeBtn} onClick={handleButtonClick}>회원가입</button>
        </div>

        <div className={`${styles.changeBox} ${isMovedLeft ? styles.moveLeft : ''}`}></div>

        <div className={`${styles.signUpDes} ${isMovedLeft ? '' : styles.moveLeft}`}>
          <h1 style={{ color: "white" }}> Wellcome MiC! </h1>
          <p style={{ color: "white" }}>사용자 정보들을 입력해주세요</p>
          <p style={{ color: "white" }}>비밀번호는 8자 이상이어야 하며</p>
          <p style={{ color: "white" }}>영문자, 숫자를 포함해야합니다.</p>
          <button className={styles.changeBtn} onClick={handleButtonClick}>로그인</button>
        </div>

        <div ref={signInRef} className={styles.signIn} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>로그인</h1>
          <span className="red">{loginMessage}</span>
          <div className="makeGroup">
            <input className="makeField" ref={signInIdRef} type="text" placeholder="아이디"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" ref={signInPasswordRef} type="password" placeholder="비밀번호"></input>
          </div>
          <button className="makeButton" onClick={loginUser}>
            {isLoading ? <div className="loading"></div> : <div>로그인</div>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login