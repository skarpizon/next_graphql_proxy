const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Query {
    currentUser: User
  }
  type Mutation {
    auth(email: String!, password: String!): Token
    signUp(email: String!, password: String!): Success
    signUpConfirm(email: String!, code: String!): Success
    getRecoveryCode(email: String!): Success
    recoverPassword(email: String!, password: String!, code: String!): Success
    accessToken(token: String!): AccessToken
  }
  type User {
    id: ID!
    email: String
    telegram_id: String
    computers: [Computer]
  }
  type Success {
    success: Boolean
    error: String
  }
  type Token {
    refresh_token: String
  }
  type AccessToken {
    access_token: String
  }
`

module.exports = typeDefs
