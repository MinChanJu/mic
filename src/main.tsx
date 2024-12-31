import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // React Router 추가
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* React Router로 App 컴포넌트 감싸기 */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);