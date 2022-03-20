import React, { forwardRef, useRef } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useRouter } from 'next/router'
import Form, { Field, SumbitButton } from '../../src/components/core/Form'
import { gql, useMutation } from '@apollo/client'
import TextField from '../../src/components/fields/TextField'
import { DialogActions, DialogContent, Grid } from '@mui/material'
import Dialog from '../../src/components/core/Dialog'
import Button from '../../src/components/core/Button'

const AUTH_MUTATION = gql`
  mutation auth($email: String!, $password: String!) {
    auth(email: $email, password: $password) {
      refresh_token
    }
  }
`

const SIGNUP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      success
    }
  }
`

const SignUp = forwardRef(function SignUpModal (props, ref) {
  const [signUp, { loading }] = useMutation(SIGNUP_MUTATION)

  const handleSubmit = (data) => {
    signUp({ variables: data }).then(() => {
      ref?.current?.close()
    })
  }

  return (
    <Dialog ref={ref} maxWidth='xs' title='Sign Up'>
      <DialogContent>
        <Grid container spacing={1} direction='column' alignItems='stretch'>
          <Grid item xs={12}>
            <Field field='email' label='Email Address' component={TextField} required />
          </Grid>
          <Grid item xs={12}>
            <Field field='password' label='Password' type='password' component={TextField} required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <SumbitButton loading={loading} label='Sign Up' onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  )
})

function Copyright(props) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright @ '}
      {new Date().getFullYear()}
    </Typography>
  )
}

function Auth() {
  const router = useRouter()
  const [auth, { loading }] = useMutation(AUTH_MUTATION)
  const signUpModal = useRef()

  const handleSubmit = (data) => {
    auth({ variables: data }).then(() => {
      router.push('/')
    })
  }

  const handleOpenSignUp = () => {
    signUpModal?.current?.open()
  }

  return (
    <>
      <Form>
        <SignUp ref={signUpModal} />
      </Form>
      <Form>
        <Container component='main' maxWidth='xs' sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Grid container spacing={2} direction='column' alignItems='stretch'>
              <Grid item alignSelf='center'>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                  Sign in
                </Typography>
              </Grid>
              <Grid item>
                <Field field='email' label='Email Address' component={TextField} required />
              </Grid>
              <Grid item>
                <Field field='password' label='Password' type='password' component={TextField} required />
              </Grid>
              <Grid item>
                <SumbitButton
                  loading={loading}
                  label='Sign In'
                  onClick={handleSubmit}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Button label="Don't have an account? Sign Up" variant='text' sx={{ textTransform: 'none' }} onClick={handleOpenSignUp} />
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </Form>
    </>
  )
}

export default Auth
