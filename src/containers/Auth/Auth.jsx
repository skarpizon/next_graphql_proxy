import React from "react"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { useRouter } from "next/router"
import Form, { Field, SumbitButton } from "@/components/core/Form"
import { useMutation } from "@apollo/client"
import TextField from "@/components/fields/TextField"
import Button from "@/components/core/Button"
import SignUp from "./SignUp"
import { Grid } from "@mui/material"
import Copyright from "@/components/Copyright"
import Route from "@/components/Route"
import Confirm from "./Confirm"
import { AUTH_MUTATION } from "@/data/auth"
import {
  CONFIRM_PATH,
  REQUEST_RECOVERY_PATH,
  RESET_PASSWORD_PATH,
  SIGNUP_PATH
} from "@/data/paths"
import RequestRecovery from "./RequestRecovery"
import ResetPassword from "./ResetPassword"

function Auth() {
  const router = useRouter()
  const [auth, { loading }] = useMutation(AUTH_MUTATION)

  const handleSubmit = (data) => {
    auth({ variables: data }).then(() => {
      router.push("/")
    })
  }

  const handleOpenSignUp = () => {
    router.push(SIGNUP_PATH)
  }

  const handleOpenRecovery = () => {
    router.push(REQUEST_RECOVERY_PATH)
  }

  return (
    <>
      <Route path={SIGNUP_PATH}>
        <Form>
          <SignUp />
        </Form>
      </Route>
      <Route path={CONFIRM_PATH}>
        <Confirm />
      </Route>
      <Route path={REQUEST_RECOVERY_PATH}>
        <Form>
          <RequestRecovery />
        </Form>
      </Route>
      <Route path={RESET_PASSWORD_PATH}>
        <Form>
          <ResetPassword />
        </Form>
      </Route>
      <Form>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Grid container spacing={2} direction="column" alignItems="stretch">
              <Grid item alignSelf="center">
                <Avatar sx={{ m: 2, mb: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
              </Grid>
              <Grid item>
                <Field
                  field="email"
                  label="Email Address"
                  component={TextField}
                  required
                />
              </Grid>
              <Grid item>
                <Field
                  field="password"
                  label="Password"
                  type="password"
                  component={TextField}
                  required
                />
              </Grid>
              <Grid item>
                <SumbitButton
                  loading={loading}
                  label="Sign In"
                  onClick={handleSubmit}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item xs>
                    <Button
                      label="Don't have an account? Sign Up"
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={handleOpenSignUp}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      label="Forgot password?"
                      variant="text"
                      sx={{ textTransform: "none" }}
                      onClick={handleOpenRecovery}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </Form>
    </>
  )
}

export default Auth
