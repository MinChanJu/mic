import React, { useEffect, useState } from 'react'
import { getContestById, getContestList } from '../api/contest'
import { useUser } from '../context/UserContext'
import { FormatFunctions } from '../utils/formatter'
import { ContestListDTO } from '../types/dto/ContestListDTO'
import useNavigation from '../hooks/useNavigation'
import Table from '../components/Table'
import ErrorPage from '../components/ErrorPage'
import Loading from '../components/Loading'
import { resultInterval } from '../utils/resultInterval'

const ContestList: React.FC = () => {
  const { user } = useUser();
  const [contestList, setContestList] = useState<ContestListDTO[]>([]);
  const { goToContestId, goToContestMake } = useNavigation()
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function loadProblems() {
      let requestId = '';

      try {
        if (user.contestId === -1) {
          const response = await getContestList();
          requestId = response.data;
        } else {
          const response = await getContestById(user.contestId);
          requestId = response.data;
        }
      } catch (error) {
        console.error("에러: ", error);
        setError(true);
      }

      resultInterval('contests', requestId, setError, setLoad, setContestList)
    }
    loadProblems();
  }, []);

  if (error) return <ErrorPage />
  if (!load) return <Loading width={60} border={6} marginTop={250} />

  const check = (item: ContestListDTO, click: boolean): string => {
    if (click) {
      if (item.userId == user.userId || user.authority == 5) {
        goToContestId(item.contestId)
        return "";
      }
    }
    if (item.startTime == null) {
      if (click) goToContestId(item.contestId)
      return "after";
    }

    const now = new Date()
    const event = new Date(item.startTime)
    if (now < event) {
      if (click) alert("아직 대회시간이 아닙니다.")
      return "before";
    }

    if (item.endTime == null) {
      if (click) goToContestId(item.contestId!)
      return "after";
    }

    const finish = new Date(item.endTime)
    if (now <= finish) {
      if (item.contestId == user.contestId) {
        if (click) goToContestId(item.contestId!)
        return "ongoingPos"
      }
      if (click) alert("아직 대회시간이 아닙니다.")
      return "ongoingImp";
    }

    if (click) goToContestId(item.contestId!)
    return "after";
  }

  return (
    <div className='list'>
      <h1>대회 목록</h1>
      {user.authority >= 3 && <h3 onClick={goToContestMake}>대회 개최</h3>}
      <Table
        columnName={["번호", "대회 제목", "주최", "시작", "종료"]}
        columnClass={["num", "", "", "time", "time"]}
        data={contestList}
        dataName={["id", "contestName", "userId", "startTime", "endTime"]}
        dataFunc={FormatFunctions}
        onClick={(item) => { check(item, true); }}
        rowClass={(item) => { return check(item, false); }} />
      {contestList.length === 0 && <div>대회가 존재하지 않습니다.</div>}
    </div>
  );
}



export default ContestList;
