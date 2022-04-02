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
import { SIGNUP_MUTATION } from "@/data/auth"
import { useMutation } from "@apollo/client"
import TextField from "@/components/fields/TextField"
import { useRouter } from "next/router"
import Route from "@/components/Route"
import Button from "@/components/core/Button"
import { AUTH_PATH, SIGNUP_COMPLETE_PATH, SIGNUP_PATH } from "@/data/paths"

function SignUp(props, ref) {
  const router = useRouter()
  const [signUp, { loading }] = useMutation(SIGNUP_MUTATION)

  const handleSubmit = (data) => {
    signUp({ variables: data }).then(() => {
      router.push(SIGNUP_COMPLETE_PATH)
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
      title="Sign Up"
      open
      onClose={handleClose}
      disableBackClose
    >
      <Route exact path={SIGNUP_PATH}>
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
            <Grid item xs={12}>
              <Field
                field="password"
                label="Password"
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
            label="Sign Up"
            onClick={handleSubmit}
          />
        </DialogActions>
      </Route>
      <Route path={SIGNUP_COMPLETE_PATH}>
        <DialogContent>
          <Box>
            <Typography gutterBottom>Thank you for sign up!</Typography>
            <Typography>
              Confirmation link will be sent to your E-mail within a few minutes
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

export default forwardRef(SignUp)
