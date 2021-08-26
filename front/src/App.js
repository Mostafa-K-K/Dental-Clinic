import React from 'react'
import Routes from './components/Routes'
import { BrowserRouter as Router } from 'react-router-dom'
import SessionProvider from './components/session/SessionProvider'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme'
import { ToastContainer } from "react-toastify"

import './App.css'

export default function App(props) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>

        <Router>
          <Routes {...props} />
        </Router>

      </ThemeProvider>
      <ToastContainer />
    </SessionProvider>
  );
}