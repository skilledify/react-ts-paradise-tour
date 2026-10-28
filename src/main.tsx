import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Глобальные стили — первыми, чтобы CSS-модули могли их переопределять */
import './styles/global.scss';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
