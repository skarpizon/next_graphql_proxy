import { addApolloState, initializeApollo } from '../apolloClient'


export default (query) => async (context) => {
  const cookie = context.req.headers.cookie
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: query,
    context: { headers: { cookie } }
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}