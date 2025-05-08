import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create the root element and render the App with StrictMode for development
const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);