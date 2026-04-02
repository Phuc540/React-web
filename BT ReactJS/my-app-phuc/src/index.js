import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/i18n';
import './index.css';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

reportWebVitals();
