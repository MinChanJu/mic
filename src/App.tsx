import Header from './components/Header';
import './App.css'
import AppRoutes from './routes';
import { UserProvider } from './context/UserContext';
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <Header />
        <AppRoutes />
      </HashRouter>
    </UserProvider>
  )
}

export default App
