import axios from 'axios';

declare const process: {
  env: {
    NODE_ENV: string;
  };
};

const URL = process.env.NODE_ENV === 'production'
  ? "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api"  // 배포 서버 주소
  : "http://localhost:8080/api";  // 로컬 주소

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: URL,                          // Spring Boot 서버 주소
  timeout: 10000,                         // 요청 제한 시간 (10초)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (예: 토큰 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');  // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (예: 에러 처리)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;