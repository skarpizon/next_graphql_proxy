import { gql } from '@apollo/client'
import { NextResponse } from 'next/server'
import { initializeApollo } from '../src/apolloClient'

const ACCESS_TOKEN_MUTATION = gql`
  mutation getAccessToken($token: String!) {
    accessToken(token: $token) {
      access_token
    }
  }
`

export async function middleware(request, ev) {
  console.log('middle', request);
  console.log('request.nextUrl.pathname', request.nextUrl.pathname);
  let response = NextResponse.next()

  if (request.nextUrl.pathname.includes('/auth')) {
    if (request.nextUrl.pathname.includes('/logout')) {
      console.log('request', request);
      response = NextResponse.redirect('/auth')
      response.clearCookie('refresh_token')
      response.clearCookie('access_token')
      console.log('response', response);
      return response
    }
    if (request.cookies['refresh_token']) {
      return NextResponse.redirect('/')
    }
  } else {
    if (!request.cookies['refresh_token']) {
      return NextResponse.redirect('/auth')
    }
  }

  if (request.cookies['refresh_token'] && !request.cookies['access_token']) {
    try {
      const apolloClient = initializeApollo()
  
      const res = await apolloClient.mutate({
        mutation: ACCESS_TOKEN_MUTATION,
        variables: {
          token: request.cookies['refresh_token']
        }
      })
  
      const at = res?.data?.accessToken?.access_token
  
      if (at) {
        response.cookie('access_token', at, {
          maxAge: 7000000,
          httpOnly: true
        })
      }
    } catch (error) {
      response = NextResponse.redirect('/auth')
      response.clearCookie('refresh_token')
      response.clearCookie('access_token')
      return response
    }
  }
  return response
}