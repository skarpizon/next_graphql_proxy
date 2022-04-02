import { addApolloState, initializeApollo } from "../apolloClient"

const SSPGenerator = (query) => async (context) => {
  const cookie = context.req.headers.cookie
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: query,
    context: { headers: { cookie } }
  })

  return addApolloState(apolloClient, {
    props: {}
  })
}

export default SSPGenerator
