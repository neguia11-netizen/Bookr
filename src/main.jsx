import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Success from './Success.jsx'
import Portfolio from './Portfolio.jsx'
import Admin from './Admin.jsx'
import GiftCard from './GiftCard.jsx'
import GiftSuccess from './GiftSuccess.jsx'

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/success' ? <Success />
    : path === '/portfolio' ? <Portfolio />
    : path === '/admin' ? <Admin />
    : path === '/giftcard' ? <GiftCard />
    : path === '/giftsuccess' ? <GiftSuccess />
    : <App />}
  </React.StrictMode>,
)
