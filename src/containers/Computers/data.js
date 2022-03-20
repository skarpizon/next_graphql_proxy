import { gql } from '@apollo/client'

export const COMPUTERS_BRANCH = '/computers'

const gqlTableFields = `
id
name
thread_count
ram_amount
ram_usage
load_average
uptime
status
`

const gqlFields = `
${gqlTableFields}
login
booked_thread_count
booked_ram_amount
application_version
autoplot_mode
`

export const ALL_COMPUTERS_QUERY = gql`
query {
  computers {
    ${gqlTableFields}
  }
}
`

export const CREATE_COMPUTER_MUTATION = gql`
mutation createComputer(
  $name: String,
) {
  createComputer(
    name: $name
  ) {
    ${gqlTableFields}
  }
}
`

export const UPDATE_COMPUTER_MUTATION = gql`
mutation updateComputer(
  $id: ID!,
  $name: String
) {
  updateComputer(
    id: $id,
    name: $name
  ) {
    ${gqlTableFields}
  }
}
`

export const DELETE_COMPUTER_MUTATION = gql`
mutation deleteComputer(
  $id: ID!
) {
  deleteComputer(
    id: $id
  ) {
    success
  }
}
`
