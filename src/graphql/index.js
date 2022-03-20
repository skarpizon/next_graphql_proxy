const { ApolloServer, gql } = require('apollo-server-express')
const Api = require('./apiDataSource')
const cookie = require('cookie')

const typeDefs = gql`
  type Query {
    books: [Book]!
    computers: [Computer]
    credentials: [Credential]
  }
  type Mutation {
    auth(email: String!, password: String!): Token
    signUp(email: String!, password: String!): Success
    accessToken(token: String!): AccessToken
    createCredential(
      name: String,
      farmer_public_key: String,
      pool_contract_address: String,
      cold_wallet_address: String,
      farm_wallet_mnemonic: String!
    ): Credential
    updateCredential(
      id: ID!
      name: String,
      farmer_public_key: String,
      pool_contract_address: String,
      cold_wallet_address: String,
      farm_wallet_mnemonic: String
    ): Credential
    deleteCredential(
      id: ID!
    ): Success
  }
  type Success {
    success: Boolean
  }
  type Token {
    refresh_token: String
  }
  type AccessToken {
    access_token: String
  }
  type Book {
    title: String
    author: String
  }
  type Computer {
    id: ID!
    name: String
    login: String
    thread_count: Int
    booked_thread_count: Int
    ram_amount: Float
    booked_ram_amount: Int
    ram_usage: Float
    load_average: String
    uptime: String
    application_version: String
    status: String
    autoplot_mode: String
  }
  type Credential {
    id: ID!
    name: String
    farmer_public_key: String
    pool_contract_address: String
    cold_wallet_address: String
    farm_wallet_mnemonic: String!
  }
`

const resolvers = {
  Query: {
    computers: async (_, __, { dataSources }) => dataSources.api.getComputers(),
    credentials: async (_, __, { dataSources }) => dataSources.api.getCredentials()
  },
  Mutation: {
    auth: async (_, data, { dataSources }) => await dataSources.api.auth(data),
    signUp: async (_, data, { dataSources }) => await dataSources.api.signUp(data),
    accessToken: async (_, data, { dataSources }) => await dataSources.api.getAccessToken({ refresh_token: data?.token }),
    createCredential: async (_, data, { dataSources }) => await dataSources.api.createCredential(data),
    updateCredential: async (_, data, { dataSources }) => await dataSources.api.updateCredential(data),
    deleteCredential: async (_, data, { dataSources }) => await dataSources.api.deleteCredential(data),
  }
}

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  dataSources: () => ({
    api: new Api()
  }),
  context: async ({ req }) => {
    let refreshToken = null
    let accessToken = null
    if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie)
      if (cookies?.refresh_token) {
        refreshToken = cookies?.refresh_token
        accessToken = cookies?.access_token
      }
    }
    return {
      refresh_token: refreshToken,
      access_token: accessToken,
      new_refresh_token: null,
      new_access_token: null
    }
  },
  formatResponse: (response, requestContext) => {
    const rt = requestContext.context?.new_refresh_token
    if (rt) {
      const rtStr = cookie.serialize('refresh_token', rt, {
        maxAge: 365 * 24 * 3600,
        httpOnly: true
      })
      requestContext.response.http.headers.set('Set-Cookie', rtStr)
    }
  }
})

module.exports = server
