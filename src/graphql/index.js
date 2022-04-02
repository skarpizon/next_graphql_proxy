const { ApolloServer } = require("apollo-server-express")
const Api = require("./apiDataSource")
const cookie = require("cookie")
const typeDefs = require("./typeDefs")
const {
  typeDefs: scalarTypeDefs,
  resolvers: scalarResolvers
} = require("graphql-scalars")
const { merge } = require("lodash")

const resolvers = {
  Query: {
    currentUser: async (_, __, { dataSources }) =>
      await dataSources.api.currentUser()
  },
  Mutation: {
    auth: async (_, data, { dataSources }) => await dataSources.api.auth(data),
    signUp: async (_, data, { dataSources }) =>
      await dataSources.api.signUp(data),
    signUpConfirm: async (_, data, { dataSources }) =>
      await dataSources.api.signUpConfirm(data),
    getRecoveryCode: async (_, data, { dataSources }) =>
      await dataSources.api.getRecoveryCode(data),
    recoverPassword: async (_, data, { dataSources }) =>
      await dataSources.api.recoverPassword(data),
    accessToken: async (_, data, { dataSources }) =>
      await dataSources.api.getAccessToken({ refresh_token: data?.token })
  }
}

const server = new ApolloServer({
  typeDefs: [scalarTypeDefs, typeDefs],
  resolvers: merge(resolvers, scalarResolvers),
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
      const rtStr = cookie.serialize("refresh_token", rt, {
        maxAge: 365 * 24 * 3600,
        httpOnly: true
      })
      requestContext.response.http.headers.set("Set-Cookie", rtStr)
    }
  }
})

module.exports = server
