import { createTheme } from '@mui/material/styles'

const getTheme = (themeMode) => createTheme({
  palette: {
    mode: themeMode,
  },
})

export default getTheme
