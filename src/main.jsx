import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Success from './Success.jsx'

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/success' ? <Success /> : <App />}
  </React.StrictMode>,
)
