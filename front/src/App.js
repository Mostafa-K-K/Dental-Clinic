import React from 'react'
import Routes from './components/Routes'
import { BrowserRouter as Router } from 'react-router-dom'
import SessionProvider from './components/session/SessionProvider'
import './App.css'

export default function App(props) {
  return (
    <SessionProvider>
      <Router>
        <Routes {...props} />
      </Router>
    </SessionProvider>
  );
}