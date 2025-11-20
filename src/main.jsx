import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App.jsx'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
   


const theme = createTheme({
  palette: {
  mode: 'light',
  primary: { main: '#1976d2' },
  secondary: { main: '#9c27b0' },
  },
  components: {
  MuiAppBar: { defaultProps: { elevation: 3 } }
  }
  });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      </ThemeProvider>
  </StrictMode>,
)
