import React, { useEffect, useRef, useState } from "react"
import { AxiosError } from "axios"
import { login, register } from "../api/user"
import { useUser } from "../context/UserContext"
import { InitUser, User } from "../types/entity/User"
import useNavigation from "../hooks/useNavigation"
import styles from "../assets/css/Login.module.css"
import { UserLoginDTO } from "../types/dto/UserLoginDTO"
import Loading from "../components/Loading"
import { resultInterval } from "../utils/resultInterval"
import { UserResponseDTO } from "../types/dto/UserResponseDTO"

const Login: React.FC = () => {
  const { setUser } = useUser();
  const { goToHome } = useNavigation()
  const [isMovedLeft, setIsMovedLeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInRef = useRef<HTMLDivElement | null>(null);
  const [signIn, setSignIn] = useState<UserLoginDTO>({ userId: "", userPw: "" })
  const [loginMessage, setloginMessage] = useState<string>('');

  const signUpRef = useRef<HTMLDivElement | null>(null);
  const [signUp, setSignUp] = useState<User>(InitUser);
  const [checkPassword, setCheckPassword] = useState<string>('');
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
    setIsMovedLeft(prev => !prev)
    setSignIn({ userId: '', userPw: '' })
    setSignUp(InitUser)
    setCheckPassword('')
    setloginMessage('')
    setregisterMessage('')
    setIsLoading(false)
  };

  const registerUser = async () => {
    setregisterMessage('')
    setIsLoading(true)
    if (signUp.name !== "" &&
      signUp.userId !== "" &&
      signUp.userPw !== "" &&
      signUp.email !== "" &&
      signUp.phone !== "" &&
      checkPassword !== "") {
      if (signUp.userPw === checkPassword) {
        signUp.authority = 1;
        signUp.createdAt = new Date().toISOString();

        console.log(signUp);

        let requestId = '';

        try {
          const response = await register(signUp);
          requestId = response.data;
        } catch (error) {
          setregisterMessage("알 수 없는 에러")
          console.error("알 수 없는 에러:", error);
        }

        try {
          await resultInterval("users", requestId, 500);
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
            setregisterMessage("알 수 없는 에러")
            console.error("알 수 없는 에러:", error);
          }
        }
      } else {
        setregisterMessage("비밀번호가 일치하지 않습니다.")
      }
    } else {
      setregisterMessage("빈칸을 채워 넣으세요")
    }
    setIsLoading(false)
  }

  const loginUser = async () => {
    setloginMessage('')
    setIsLoading(true)
    if (signIn.userId !== "" && signIn.userPw !== "") {
      let requestId = '';
      try {
        const response = await login(signIn);
        requestId = response.data;
      } catch (error) {
        setloginMessage("알 수 없는 에러")
        console.error("알 수 없는 에러:", error);
      }

      try {
        const response = await resultInterval<UserResponseDTO>("users", requestId, 500);
        setUser(response.user)
        sessionStorage.setItem('token', response.token);
        goToHome();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            setloginMessage(error.response.data.message);
            console.error("응답 에러: ", error.response.data.message)
          }
          else {
            setloginMessage("서버 에러")
            console.error("서버 에러:", error);
          }
        } else {
          setloginMessage("알 수 없는 에러")
          console.error("알 수 없는 에러:", error);
        }
      }
    } else {
      setloginMessage("빈칸을 채워 넣으세요")
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
            <input className="makeField" value={signUp.name} onChange={(e) => setSignUp({ ...signUp, "name": e.target.value })} type="text" placeholder="닉네임"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={signUp.userId} onChange={(e) => setSignUp({ ...signUp, "userId": e.target.value })} type="text" placeholder="아이디"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={signUp.userPw} onChange={(e) => setSignUp({ ...signUp, "userPw": e.target.value })} type="password" placeholder="비밀번호"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} type="password" placeholder="비밀번호 확인"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={signUp.email} onChange={(e) => setSignUp({ ...signUp, "email": e.target.value })} type="text" placeholder="이메일"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={signUp.phone} onChange={(e) => setSignUp({ ...signUp, "phone": e.target.value })} type="text" placeholder="전화번호"></input>
          </div>
          <button className="makeButton" onClick={registerUser}>
            {isLoading ? <Loading />  : <div>회원가입</div>}
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
            <input className="makeField" value={signIn.userId} onChange={(e) => setSignIn({ ...signIn, "userId": e.target.value })} type="text" placeholder="아이디"></input>
          </div>
          <div className="makeGroup">
            <input className="makeField" value={signIn.userPw} onChange={(e) => setSignIn({ ...signIn, "userPw": e.target.value })} type="password" placeholder="비밀번호"></input>
          </div>
          <button className="makeButton" onClick={loginUser}>
            {isLoading ? <Loading /> : <div>로그인</div>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login