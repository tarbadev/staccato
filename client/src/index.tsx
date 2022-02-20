import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './components/App'
import * as serviceWorker from './serviceWorker'
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme()

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {
  }
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
