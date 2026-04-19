import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Success from './Success.jsx'
import Portfolio from './Portfolio.jsx'

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/success' ? <Success /> : path === '/portfolio' ? <Portfolio /> : <App />}
  </React.StrictMode>,
)
