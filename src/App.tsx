import Header from './components/Header';
import './App.css'
import AppRoutes from './routes';
import { UserProvider } from './context/UserContext';
import {  BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <Router basename='/mic-react/'>
        <Header />
        <AppRoutes />
      </Router>
    </UserProvider>
  )
}

export default App
