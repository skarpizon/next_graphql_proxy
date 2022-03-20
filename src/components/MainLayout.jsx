import {
  AppBar,
  Box,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Toolbar,
  Typography
} from '@mui/material'
import Brightness4RoundedIcon from '@mui/icons-material/Brightness4Rounded'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import { map } from 'lodash-es'
import Link from './core/Link'
import IconButton from './core/IconButton'
import cookie from 'cookie'
import { useRouter } from 'next/router'
import Image from 'next/image'

const routes = [
  {
    label: 'Dashboard',
    link: '/'
  },
  {
    label: 'Сredentials',
    link: '/credentials'
  }
]

const drawerWidth = 240

const Drawer = styled(MuiDrawer)({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    boxSizing: 'border-box',
  },
})

const COOKIE_THEME_MODE = 'themeMode'

function ThemeMode () {
  const router = useRouter()

  function switchMode () {
    const cookies = cookie.parse(document.cookie)
    const newCookie = cookie.serialize(COOKIE_THEME_MODE,
  cookies[COOKIE_THEME_MODE] === 'dark' ? 'light' : 'dark',
  {
      maxAge: 365 * 24 * 3600
    })
    document.cookie = newCookie
    router.reload()
  }

  return (
    <IconButton color='inherit' size='medium' icon={Brightness4RoundedIcon} onClick={switchMode} tooltip='Change theme' />
  )
}

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  flexWrap: 'nowrap'
}))

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant='permanent' open sx={{ width: drawerWidth }}>
        <List component='nav'>
          <LogoContainer>
            <Image src='/logo.png' alt='logo' width='48' height='48' />
            <Typography variant='h5' sx={{ ml: 2, textTransform: 'uppercase', letterSpacing: 2 }}>
              Graph<sup>QL</sup>
            </Typography>
          </LogoContainer>
          <Divider sx={{ my: 1 }} />
          {map(routes, ({ label, link }) => (
            <ListItem key={label} component={Link} href={link} disablePadding>
              <ListItemButton>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component='main'
        sx={{
          position: 'relative',
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <AppBar position='absolute' color='primary'>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <ThemeMode />
            <Link href='/auth/logout'><IconButton color='inherit' size='medium' icon={ExitToAppRoundedIcon} tooltip='Exit' /></Link>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: 8,
            p: 2
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
