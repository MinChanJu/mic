import { Route, Routes } from 'react-router-dom';
import ContestManage from './pages/ContestManage';
import ContestList from './pages/ContestList';
import EditContest from './pages/ContestEdit';
import ContestMake from './pages/ContestMake';
import ContestView from './pages/ContestView';
import ProblemList from './pages/ProblemList';
import EditProblem from './pages/ProblemEdit';
import ProblemMake from './pages/ProblemMake';
import ProblemView from './pages/ProblemView';
import SettingView from './pages/SettingView';
import NoticeBoard from './pages/NoticeBoard';
import NoticeView from './pages/NoticeView';
import ReportView from './pages/ReportView';
import ScoreBoard from './pages/ScoreBoard';
import PageTitle from './components/PageTitle';
import ErrorPage from './components/ErrorPage';
import UserView from './pages/UserView';
import Login from './pages/Login';
import Home from './pages/Home';

const AppRoutes = () => (
  <>
    <PageTitle />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contest" element={<ContestList />} />
      <Route path="/contest/edit/:contestId" element={<EditContest />} />
      <Route path="/contest/make" element={<ContestMake />} />
      <Route path="/contest/manage/:contestId" element={<ContestManage />} />
      <Route path="/contest/:contestId" element={<ContestView />} />
      <Route path="/score/:contestId" element={<ScoreBoard />} />
      <Route path="/problem" element={<ProblemList />} />
      <Route path="/problem/edit/:problemId" element={<EditProblem />} />
      <Route path="/problem/make/:contestId" element={<ProblemMake />} />
      <Route path="/problem/:problemId" element={<ProblemView />} />
      <Route path="/user/:userId" element={<UserView />} />
      <Route path="/setting" element={<SettingView />} />
      <Route path="/report" element={<ReportView />} />
      <Route path="/notice" element={<NoticeBoard />} />
      <Route path="/notice/:noticeId" element={<NoticeView />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </>
);

export default AppRoutes;