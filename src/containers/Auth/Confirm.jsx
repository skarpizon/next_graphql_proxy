import { forwardRef, useEffect } from "react"
import Dialog from "@/components/core/Dialog"
import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  Typography
} from "@mui/material"
import { SIGNUP_CONFIRMATION_MUTATION } from "@/data/auth"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"
import Button from "@/components/core/Button"
import { isNil } from "lodash-es"
import { AUTH_PATH } from "@/data/paths"

function Confirm(props, ref) {
  const router = useRouter()
  const [
    signUpConfirm,
    { loading, data: { signUpConfirm: { success, error } = {} } = {} }
  ] = useMutation(SIGNUP_CONFIRMATION_MUTATION)

  useEffect(() => {
    const email = router?.query?.email
    const code = router?.query?.code
    if (email && code) {
      signUpConfirm({
        variables: {
          email,
          code
        }
      }).catch(() => {})
    }
  }, [router])

  const handleClose = () => {
    router.push(AUTH_PATH)
  }

  const processing = loading || isNil(success)

  return (
    <Dialog
      ref={ref}
      maxWidth="xs"
      title="Confirmation"
      open
      onClose={handleClose}
      disableBackClose
    >
      <DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          {processing && <CircularProgress />}
          {success && <Typography gutterBottom>Sign up complete!</Typography>}
          {success === false && (
            <Typography gutterBottom>
              {error ?? "Something went wrong"}
            </Typography>
          )}
        </Box>
      </DialogContent>
      {!processing && (
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button label="Ok" onClick={handleClose} />
        </DialogActions>
      )}
    </Dialog>
  )
}

export default forwardRef(Confirm)
