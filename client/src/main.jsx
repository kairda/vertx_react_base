import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { store } from './store/store'
import NavBar from './NavBar'
import App from './App'

const theme = createTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar>
          <App />
        </NavBar>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
