import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode> react1react-beautiful-dndが使えないためコメントアウト
    <App />
  // </React.StrictMode>
);

reportWebVitals();
