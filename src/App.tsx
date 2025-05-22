import { HashRouter } from 'react-router-dom';
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
      <HashRouter basename='/mic'>
        <Header />
        <AppRoutes />
      </HashRouter>
    </UserProvider>
  )
}

export default App
