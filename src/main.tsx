import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './aws-config'; // import aws config as early as possible
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
