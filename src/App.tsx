import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Contest, CurrentContest, Problem, Solved, User } from './model/talbe';
import { severComposeData } from './model/server';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import ContestList from './components/ContestList';
import EditContest from './components/EditContest';
import ContestMake from './components/ContestMake';
import ContestView from './components/ContestView';
import ProblemList from './components/ProblemList';
import EditProblem from './components/EditProblem';
import ProblemMake from './components/ProblemMake';
import ProblemView from './components/ProblemView';
import UserView from './components/UserView';
import SettingView from './components/SettingView';
import './App.css'

function App() {
  const [user, setUser] = useState<User>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: -1, contest: -1, createdAt: '' };
  });
  const [currentContest,setCurrentContest] = useState<CurrentContest>({contestId:-1, contestName: ''})
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [solveds, setSolveds] = useState<Solved[]>([]);

  useEffect(() => {
    severComposeData('data', user, setProblems, setContests, setSolveds);
  }, []);

  return (
    <div>
      <Header user={user} setUser={setUser} setSolveds={setSolveds} problems={problems} contests={contests} setCurrentContest={setCurrentContest} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/contest" element={<ContestList user={user} contests={contests} setCurrentContest={setCurrentContest} />} />
        <Route path="/contest/edit/:id" element={<EditContest user={user} contests={contests} />} />
        <Route path="/contest/make" element={<ContestMake user={user} setCurrentContest={setCurrentContest} />} />
        <Route path="/contest/:id" element={<ContestView user={user} contests={contests} problems={problems} solveds={solveds} />} />
        <Route path="/problem" element={<ProblemList user={user} contests={contests} problems={problems} solveds={solveds} />} />
        <Route path="/problem/edit/:id" element={<EditProblem problems={problems} />} />
        <Route path="/problem/make" element={<ProblemMake currentContest={currentContest} user={user} />} />
        <Route path="/problem/:id" element={<ProblemView user={user} problems={problems} solveds={solveds} setSolveds={setSolveds} />} />
        <Route path="/user/:id" element={<UserView />} />
        <Route path="/setting" element={<SettingView user={user} contests={contests} problems={problems} solveds={solveds} />} />
      </Routes>
    </div>

  )
}

export default App
