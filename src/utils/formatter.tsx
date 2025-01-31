import { CSSProperties } from "react";
import { MathJax } from "better-react-mathjax";

export const TimeToString = (time: string | null): string => {
  if (time === null) return '';
  const event = new Date(time);
  const year = event.getFullYear();
  const month = String(event.getMonth() + 1).padStart(2, "0");
  const day = String(event.getDate()).padStart(2, "0");
  const hours = String(event.getHours()).padStart(2, "0");
  const minutes = String(event.getMinutes()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

export const StringToTime = (formatTime: string): string => {
  const date = new Date(formatTime);
  const timezoneOffset = date.getTimezoneOffset() * 60000;  // 분 단위 오프셋 → ms로 변환
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
}

export const FormatFunctions = {
  id: (value: number | null) => <>{String(value).padStart(3, '0')}</>,
  contestId: (value: number | null) => <>{String(value).padStart(3, '0')}</>,
  problemId: (value: number) => <>{String(value).padStart(3, '0')}</>,
  contestName: (value: string) => <>{value}</>,
  problemName: (value: string) => <MathJax>{value}</MathJax>,
  score: (value: number) => ScoreFormat(value),
  startTime: (value: string | null) => TimeToString(value),
  endTime: (value: string | null) => TimeToString(value),
  createdAt: (value: string | null) => TimeToString(value),
};

export const ScoreFormat = (value: number) => {
  if (value === -1) return <></>;

  let style: Partial<CSSProperties> = { backgroundColor: "rgb(238, 255, 0)" };
  if (value === 1000) style.backgroundColor = "rgb(43, 255, 0)";
  if (value === 0) style.backgroundColor = "rgb(255, 0, 0)";

  return <div className="solve" style={style}>{value / 10}</div>;
}