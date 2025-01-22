import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ContestList from './pages/ContestList';
import EditContest from './pages/ContestEdit';
import ContestMake from './pages/ContestMake';
import ContestView from './pages/ContestView';
import ProblemList from './pages/ProblemList';
import EditProblem from './pages/ProblemEdit';
import ProblemMake from './pages/ProblemMake';
import ProblemView from './pages/ProblemView';
import UserView from './pages/UserView';
import SettingView from './pages/SettingView';
import ScoreBoard from './pages/ScoreBoad';
import PageTitle from './components/PageTitle';

const AppRoutes = () => (
  <>
    <PageTitle />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contest" element={<ContestList />} />
      <Route path="/contest/edit/:contestId" element={<EditContest />} />
      <Route path="/contest/make" element={<ContestMake />} />
      <Route path="/contest/:contestId" element={<ContestView />} />
      <Route path="/score/:contestId" element={<ScoreBoard />} />
      <Route path="/problem" element={<ProblemList />} />
      <Route path="/problem/edit/:problemId" element={<EditProblem />} />
      <Route path="/problem/make/:contestId" element={<ProblemMake />} />
      <Route path="/problem/:problemId" element={<ProblemView />} />
      <Route path="/user/:userId" element={<UserView />} />
      <Route path="/setting" element={<SettingView />} />
      <Route path='*' element={<div>404 에러</div>} />
    </Routes>
  </>
);

export default AppRoutes;