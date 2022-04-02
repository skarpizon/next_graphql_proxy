import { forwardRef } from "react"
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
import { useRouter } from "next/router"
import Route from "@/components/Route"
import Button from "@/components/core/Button"
import {
  AUTH_PATH,
  REQUEST_RECOVERY_COMPLETE_PATH,
  REQUEST_RECOVERY_PATH
} from "@/data/paths"
import { REQUEST_RECOVERY_MUTATION } from "@/data/auth"

function RequestRecovery(props, ref) {
  const router = useRouter()
  const [getCode, { loading }] = useMutation(REQUEST_RECOVERY_MUTATION)

  const handleSubmit = (data) => {
    getCode({ variables: data }).then(() => {
      router.push(REQUEST_RECOVERY_COMPLETE_PATH)
    })
  }

  const handleClose = () => {
    router.push(AUTH_PATH)
  }

  const handleContinue = () => {
    router.push(AUTH_PATH)
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
      <Route exact path={REQUEST_RECOVERY_PATH}>
        <DialogContent>
          <Grid container spacing={1} direction="column" alignItems="stretch">
            <Grid item xs={12}>
              <Field
                field="email"
                label="Email Address"
                component={TextField}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <SumbitButton loading={loading} label="Send" onClick={handleSubmit} />
        </DialogActions>
      </Route>
      <Route path={REQUEST_RECOVERY_COMPLETE_PATH}>
        <DialogContent>
          <Box>
            <Typography gutterBottom>Check your E-mail</Typography>
            <Typography>
              Recovery code will be sent to your E-mail within a few minutes
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button loading={loading} label="ok" onClick={handleContinue} />
        </DialogActions>
      </Route>
    </Dialog>
  )
}

export default forwardRef(RequestRecovery)
