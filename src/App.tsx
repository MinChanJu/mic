import Header from './components/Header';
import './App.css'
import AppRoutes from './routes';
import { UserProvider } from './context/UserContext';
import {  BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
