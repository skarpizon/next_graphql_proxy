import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import MuiLink from '@mui/material/Link'
import { styled } from '@mui/material/styles'

const Anchor = styled('a')({
  color: 'inherit',
  textDecoration: 'none'
})

export const NextLinkComposed = React.forwardRef(function NextLinkComposed(props, ref) {
  const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  )
})

const Link = React.forwardRef(function Link(props, ref) {
  const {
    activeClassName = 'active',
    as: linkAs,
    className: classNameProps,
    href,
    withStyle = false,
    role,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  const isExternal =
    typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)
  if (isExternal) {
    if (!withStyle) {
      return <Anchor className={className} href={href} ref={ref} {...other} />
    }

    return <MuiLink className={className} href={href} ref={ref} {...other} />
  }

  if (!withStyle) {
    return <NextLinkComposed className={className} ref={ref} to={href} {...other} />
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      linkAs={linkAs}
      className={className}
      ref={ref}
      to={href}
      {...other}
    />
  )
})

export default Link
