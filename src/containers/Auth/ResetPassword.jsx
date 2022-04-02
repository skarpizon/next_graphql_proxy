import { forwardRef, useState } from "react"
import Dialog from "@/components/core/Dialog"
import { Field, SumbitButton } from "@/components/core/Form"
import {
  Box,
  DialogActions,
  DialogContent,
  Grid,
  Typography
} from "@mui/material"
import { useMutation } from "@apollo/client"
import TextField from "@/components/fields/TextField"
import Route from "@/components/Route"
import Button from "@/components/core/Button"
import {
  AUTH_PATH,
  RESET_PASSWORD_COMPLETE_PATH,
  RESET_PASSWORD_PATH
} from "@/data/paths"
import { RECOVER_PASSWORD_MUTATION } from "@/data/auth"
import { useRouter } from "next/router"

function ResetPassword(props, ref) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [resetPassword, { loading }] = useMutation(RECOVER_PASSWORD_MUTATION)

  const handleSubmit = (data) => {
    const email = router?.query?.email
    const code = router?.query?.code
    if (email && code) {
      resetPassword({
        variables: {
          ...data,
          email,
          code
        }
      }).then((res) => {
        if (res?.data?.recoverPassword?.error) {
          setError(res?.data?.recoverPassword?.error)
        } else if (res?.recoverPassword?.success) {
          router.push(RESET_PASSWORD_COMPLETE_PATH)
        }
      })
    }
  }

  const handleClose = () => {
    router.push(AUTH_PATH)
  }

  const handleCloseError = () => {
    setError(false)
  }

  return (
    <Dialog
      ref={ref}
      maxWidth="xs"
      title="Reset password"
      open
      onClose={handleClose}
      disableBackClose
    >
      <Route path={RESET_PASSWORD_PATH}>
        {!error ? (
          <>
            <DialogContent>
              <Grid
                container
                spacing={1}
                direction="column"
                alignItems="stretch"
              >
                <Grid item xs={12}>
                  <Field
                    field="password"
                    label="New password"
                    type="password"
                    component={TextField}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: 2, pr: 2 }}>
              <SumbitButton
                loading={loading}
                label="Send"
                onClick={handleSubmit}
              />
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Box>
                <Typography gutterBottom>Something went wrong</Typography>
                <Typography>{error}</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ pb: 2, pr: 2 }}>
              <Button
                loading={loading}
                label="Try again"
                onClick={handleCloseError}
              />
            </DialogActions>
          </>
        )}
      </Route>
      <Route path={RESET_PASSWORD_COMPLETE_PATH}>
        <DialogContent>
          <Box>
            <Typography gutterBottom>Success!</Typography>
            <Typography>The password succefully changed</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button loading={loading} label="Ok" onClick={handleClose} />
        </DialogActions>
      </Route>
    </Dialog>
  )
}

export default forwardRef(ResetPassword)
