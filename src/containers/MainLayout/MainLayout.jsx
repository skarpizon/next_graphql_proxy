import Link from "@/components/core/Link"
import {
  AppBar,
  Box,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography
} from "@mui/material"
import { map } from "lodash-es"
import Image from "next/image"
import User from "./User"
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded"
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded"
import { CREDENTIALS_PATH, MAIN_PATH } from "@/data/paths"

const routes = [
  {
    label: "Dashboard",
    link: MAIN_PATH,
    icon: DashboardRoundedIcon
  },
  {
    label: "Сredentials",
    link: CREDENTIALS_PATH,
    icon: CreditCardRoundedIcon
  }
]

const drawerWidth = 240

const Drawer = styled(MuiDrawer)({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    boxSizing: "border-box"
  }
})

const LogoContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  flexWrap: "nowrap"
}))

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open sx={{ width: drawerWidth }}>
        <List component="nav">
          <LogoContainer>
            <Image src="/logo.png" alt="logo" width={48} height={48} />
            <Typography
              variant="h5"
              sx={{ ml: 2, textTransform: "uppercase", letterSpacing: 2 }}
            >
              Simple<sup>App</sup>
            </Typography>
          </LogoContainer>
          <Divider sx={{ my: 1 }} />
          {map(routes, ({ label, link, icon: Icon }) => (
            <ListItem key={label} component={Link} href={link} disablePadding>
              <ListItemButton>
                {Icon && (
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                )}
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          position: "relative",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto"
        }}
      >
        <AppBar position="absolute" color="primary">
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <User />
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
