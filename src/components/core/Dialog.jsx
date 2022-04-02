import React from "react"
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  IconButton,
  styled,
  Typography
} from "@mui/material"
import { bindAll } from "lodash-es"
import Button from "./Button"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

const DialogTitleDiv = styled("div")(({ theme }) => ({
  padding: theme.spacing(2, 7, 2, 3),
  "&+.MuiDialogContent-root": {
    paddingTop: theme.spacing(1)
  }
}))

const DialogTitle = (props) => {
  const { children, onClose } = props

  return (
    <DialogTitleDiv>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 1
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      ) : null}
    </DialogTitleDiv>
  )
}

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.resolver = null
    this.rejecter = null
    bindAll(this, [
      "open",
      "close",
      "handleClose",
      "getContent",
      "handleBackClose"
    ])
  }

  componentDidMount() {
    const { open } = this.props
    if (open !== undefined) {
      this.setState({ open: open })
    }
  }

  componentDidUpdate(prevProps) {
    const { open: propsOpen } = this.props
    const { open: prevPropsOpen } = prevProps
    if (propsOpen !== undefined && propsOpen !== prevPropsOpen) {
      this.setState({ open: propsOpen })
    }
  }

  open(props = {}) {
    this.setState({ open: true })
    return new Promise((resolve, reject) => {
      this.resolver = resolve
      this.rejecter = reject
    })
  }

  close(props = {}) {
    const { type } = this.props
    const { accepted } = props
    if (accepted) {
      this.resolver()
    } else if (this.rejecter && type === "confirmation") {
      this.rejecter(false)
    }
    const { onClose } = this.props
    if (onClose) {
      onClose()
    }
    this.setState({ open: false })
  }

  handleClose(props) {
    this.close(props)
  }

  handleBackClose(props) {
    const { disableBackClose = false } = this.props
    if (!disableBackClose) this.close(props)
  }

  getContent() {
    const {
      classes,
      variant,
      type,
      appBar,
      title,
      titleActions,
      contentConfig = {},
      children
    } = this.props
    const { text, confirmLabel, rejectLabel } = contentConfig
    switch (type) {
      case "confirmation": {
        return (
          <>
            <DialogTitle onClose={() => this.close({ accepted: false })}>
              {title || "Confirm the action"}
            </DialogTitle>
            {!!text && <DialogContent>{text}</DialogContent>}
            {children}
            <DialogActions>
              <Button onClick={() => this.close({ accepted: false })}>
                {rejectLabel}
              </Button>
              <Button
                color="error"
                autoFocus
                onClick={() => this.close({ accepted: true })}
              >
                {confirmLabel}
              </Button>
            </DialogActions>
          </>
        )
      }
      default: {
        return (
          <div
            className={appBar || variant === "dialog" ? "" : classes?.content}
          >
            <DialogTitle
              titleActions={titleActions}
              onClose={() => this.close({ accepted: false })}
            >
              {title}
            </DialogTitle>
            {children}
            {variant === "dialog" && (confirmLabel || rejectLabel) && (
              <DialogActions>
                {!!rejectLabel && (
                  <Button
                    color="primary"
                    onClick={() => this.close({ accepted: false })}
                  >
                    {rejectLabel}
                  </Button>
                )}
                {!!confirmLabel && (
                  <Button
                    color="primary"
                    autoFocus
                    onClick={() => this.close({ accepted: true })}
                  >
                    {confirmLabel}
                  </Button>
                )}
              </DialogActions>
            )}
          </div>
        )
      }
    }
  }

  render() {
    const { open } = this.state
    const {
      variant,
      type,
      titleActions,
      scroll = "body",
      maxWidth = "md",
      children,
      contentConfig,
      fullScreen,
      onClose,
      disableBackClose,
      ...other
    } = this.props
    const content = this.getContent()
    if (open) {
      return (
        <MuiDialog
          open={open}
          onClose={this.handleBackClose}
          scroll={scroll}
          fullScreen={fullScreen}
          maxWidth={maxWidth}
          {...other}
        >
          {content || children}
        </MuiDialog>
      )
    } else {
      return null
    }
  }
}

export default Dialog
