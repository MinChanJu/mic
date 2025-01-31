import { useEffect, useState } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { mathJaxConfig } from "../constants/mathJaxConfig";
import { Notice } from "../types/entity/Notice";
import { FormatFunctions } from "../utils/formatter";
import useNavigation from "../hooks/useNavigation";
import Table from "../components/Table";

const NoticeBoard: React.FC = () => {
  const { goToNoticeId, goToReport } = useNavigation()
  const [noticeList, setNoticeList] = useState<Notice[]>([])

  useEffect(() => {
    setNoticeList([])
  }, []);

  return (
    <div className='list'>
      <h1>문제 목록</h1>
      <MathJaxContext config={mathJaxConfig}>
        <Table
          columnName={["번호", "제목", "글쓴이", "작성일"]}
          columnClass={["num", "", "", "time"]}
          data={noticeList}
          dataName={["id", "title", "userId", "createdAt"]}
          dataFunc={FormatFunctions}
          onClick={(item) => goToNoticeId(item.id!)} />
      </MathJaxContext>
      {noticeList.length === 0 && <div>글이 존재하지 않습니다.</div>}
      <div className="flexRow">
        <span className="button" onClick={goToReport}>오류 제보 및 기능 요청</span>
      </div>
    </div>
  )
}

export default NoticeBoard;