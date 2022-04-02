import { gql } from "@apollo/client"

export const AUTH_MUTATION = gql`
  mutation auth($email: String!, $password: String!) {
    auth(email: $email, password: $password) {
      refresh_token
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      success
    }
  }
`

export const SIGNUP_CONFIRMATION_MUTATION = gql`
  mutation signUpConfirm($email: String!, $code: String!) {
    signUpConfirm(email: $email, code: $code) {
      success
      error
    }
  }
`

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      email
    }
  }
`

export const REQUEST_RECOVERY_MUTATION = gql`
  mutation getRecoveryCode($email: String!) {
    getRecoveryCode(email: $email) {
      success
      error
    }
  }
`

export const RECOVER_PASSWORD_MUTATION = gql`
  mutation recoverPassword(
    $email: String!
    $password: String!
    $code: String!
  ) {
    recoverPassword(email: $email, password: $password, code: $code) {
      success
      error
    }
  }
`
