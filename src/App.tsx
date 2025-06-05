import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import AppRoutes from './AppRoutes';
import './styles/Global.css'
import './styles/Text.css'
import './styles/Flex.css'
import './styles/Input.css'
import './styles/Color.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter basename='/MiC'>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
