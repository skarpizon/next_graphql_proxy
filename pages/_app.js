import React, { useMemo } from 'react'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../src/createEmotionCache'
import MainLayout from '../src/components/MainLayout'
import { useApollo } from '../src/apolloClient'
import { ApolloProvider } from '@apollo/client'
import RootProviders from '../src/components/RootProviders'
import getTheme from '../src/theme'
import cookie from 'cookie'

const clientSideEmotionCache = createEmotionCache()

const defaultLayout = (page) => (
  <MainLayout>{page}</MainLayout>
)

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps = {}, themeMode } = props
  const apolloClient = useApollo(pageProps)
  const getLayout = Component.getLayout || defaultLayout

  const theme = useMemo(() => getTheme(themeMode), [themeMode])

  return (
    <ApolloProvider client={apolloClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RootProviders>
            {getLayout(<Component {...pageProps} />)}
          </RootProviders>
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}

MyApp.getInitialProps = async (props) => {
  const { ctx: { req }} = props
  let themeMode = 'light'
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document?.cookie)
    themeMode = cookies?.themeMode ?? themeMode
  }
  if (req) {
    themeMode = req?.cookies?.themeMode ?? themeMode
  }
  return { themeMode }
}

export default MyApp
