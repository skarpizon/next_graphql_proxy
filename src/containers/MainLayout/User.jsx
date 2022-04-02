import { useRef, useState } from "react"
import IconButton from "@/components/core/IconButton"
import { CURRENT_USER_QUERY } from "@/data/auth"
import wrapTooltip from "@/utils/wrapTooltip"
import { useQuery } from "@apollo/client"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popover,
  Skeleton,
  Toolbar,
  Typography
} from "@mui/material"
import Brightness4RoundedIcon from "@mui/icons-material/Brightness4Rounded"
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded"
import Link from "@/components/core/Link"
import cookie from "cookie"
import { useRouter } from "next/router"
import { LOGOUT_PATH } from "@/data/paths"

const COOKIE_THEME_MODE = "themeMode"

function ThemeMode() {
  const router = useRouter()

  function switchMode() {
    const cookies = cookie.parse(document.cookie)
    const newCookie = cookie.serialize(
      COOKIE_THEME_MODE,
      cookies[COOKIE_THEME_MODE] === "dark" ? "light" : "dark",
      {
        maxAge: 365 * 24 * 3600
      }
    )
    document.cookie = newCookie
    router.reload()
  }

  return (
    <ListItem button onClick={switchMode}>
      <ListItemIcon>
        <Brightness4RoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Change theme" />
    </ListItem>
  )
}

function User() {
  const ref = useRef()
  const [open, setOpen] = useState(false)
  const { loading, data: { currentUser } = {} } = useQuery(CURRENT_USER_QUERY)

  function handleClick() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <div>
      <Toolbar disableGutters>
        {loading ? (
          <Skeleton variant="text" width={200} />
        ) : (
          wrapTooltip(
            <Typography
              maxWidth={200}
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {currentUser?.email}
            </Typography>,
            currentUser?.email
          )
        )}
        <IconButton
          ref={ref}
          color="inherit"
          size="medium"
          onClick={handleClick}
          icon={AccountCircleIcon}
        />
      </Toolbar>
      <Popover
        open={open}
        anchorEl={ref?.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Paper>
          <List>
            <ThemeMode />
            <Divider />
            <Link href={LOGOUT_PATH}>
              <ListItem button>
                <ListItemIcon>
                  <ExitToAppRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItem>
            </Link>
          </List>
        </Paper>
      </Popover>
    </div>
  )
}

export default User
