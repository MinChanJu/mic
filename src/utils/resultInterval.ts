import { AxiosError } from "axios";
import { getResult } from "../api/common";

export const resultInterval = <T>(
  data: string,
  requestId: string,
  intervalTime: number,
  setError?: (bool: boolean) => void,
  setLoad?: (bool: boolean) => void,
  setData?: (data: T) => void,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const resultResponse = await getResult<T>(data, requestId);
        if (resultResponse.status === 202) {
          console.log("처리 중...");
        } else {
          console.log("최종 결과:", resultResponse.data);
          if (setData) setData(resultResponse.data);
          if (setLoad) setLoad(true);
          clearInterval(interval); // 인터벌 중지
          resolve(resultResponse.data); // 최종 데이터 반환
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) console.error("응답 에러: ", error.response.data.message);
          else console.error("서버 에러: ", error);
        } else {
          console.error("알 수 없는 에러:", error);
        }
        if (setError) setError(true);
        clearInterval(interval); // 에러 발생 시 인터벌 중지
        reject(error); // 에러 발생 시 reject
      }
    }, intervalTime);
  });
};