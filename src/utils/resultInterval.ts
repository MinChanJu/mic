import { getResult } from "../api/common";

export const resultInterval = <T>(
  data: string,
  requestId: string,
  setError?: (bool: boolean) => void,
  setLoad?: (bool: boolean) => void,
  setData?: (data: T) => void,
  intervalTime?: number,
): Promise<T> => {
  if (requestId == '') if (setError) setError(true)
  if (intervalTime == undefined) intervalTime = 1000;
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
        if (setError) setError(true);
        clearInterval(interval); // 에러 발생 시 인터벌 중지
        reject(error); // 에러 발생 시 reject
      }
    }, intervalTime);
  });
};