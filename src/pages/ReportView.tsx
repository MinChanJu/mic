import { useState } from "react";
import { sendMail } from "../api/myData";
import { InitReport, ReportDTO } from "../types/dto/ReportDTO";
import { resultInterval } from "../utils/resultInterval";
import { autoResize } from "../utils/resize";
import Loading from "../components/Loading";

const ReportView: React.FC = () => {
  const [report, setReport] = useState<ReportDTO>(InitReport);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [makeMessage, setMakeMessage] = useState<string>('');

  const handleSubmit = async () => {
    setMakeMessage("")
    setIsLoading(true)

    if (report.email !== '' &&
      report.title !== '' &&
      report.content !== '') {
      try {
        const requestId = await sendMail(report);
        await resultInterval("data", requestId.data);
      } catch (error) {
        console.error(error)
        setMakeMessage("서버 에러");
      }
    } else {
      setMakeMessage("빈칸을 채워 넣으세요")
    }

    setIsLoading(false)
  };

  return (
    <div className="makeContainer">
      <div className="makeBox">
        <h2>오류 제보 및 기능 요청</h2>
        <div className="makeGroup">
          <div className="makeTitle">본인 이메일</div>
          <input className="makeField" value={report.email} onChange={(e) => setReport({ ...report, "email": e.target.value })} type="text" />
        </div>
        <div className="makeGroup">
          <div className="makeTitle">제목</div>
          <input className="makeField" value={report.title} onChange={(e) => setReport({ ...report, "title": e.target.value })} type="text" />
        </div>
        <div className="makeGroup">
          <div className="makeTitle">내용</div>
          <textarea className="makeField" value={report.content}
            onChange={(e) => setReport({ ...report, "content": e.target.value })}
            style={{ minHeight: '100px' }} onInput={autoResize} />
        </div>
        <span className="red">{makeMessage}</span>
        <div className="makeButton" onClick={handleSubmit}>
          {isLoading ? <Loading /> : <div>글 보내기</div>}
        </div>
      </div>
    </div>
  )
}

export default ReportView;