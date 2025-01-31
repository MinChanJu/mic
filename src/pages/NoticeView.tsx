import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Notice } from "../types/entity/Notice";
import ErrorPage from "../components/ErrorPage";

const NoticeView: React.FC = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState<Notice>()
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);

  useEffect(() => {
    setNotice(undefined)
  }, [noticeId]);

  useEffect(() => {
    if (notice) {
      const date = new Date(notice.createdAt)
      setYear(date.getFullYear())
      setMonth(date.getMonth()+1)
      setDay(date.getDate())
    }
  }, [notice])

  if (!notice) return <ErrorPage />

  return (
    <div className="list" style={{ maxWidth: "400px" }}>
      <div className="description text30">{notice.title}</div>
      <div>
        <div className="text20">아이디: {notice.userId}</div>
        <br />
        <div className="text15">{notice.content}</div>
        <br />
        <div className="text20">작성일: {year}년 {month}월 {day}일</div>
      </div>
    </div>
  )
}

export default NoticeView;