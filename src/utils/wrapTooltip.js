import React from 'react'
import { Tooltip } from '@mui/material'

function StyledTooltip (props) {
  const { children, disabled, ...other } = props
  if (disabled) {
    return (
      <Tooltip {...other}>
        <span>
          {children}
        </span>
      </Tooltip>
    )
  }
  return (
    <Tooltip {...other}>
      {children}
    </Tooltip>
  )
}

function wrapTooltip (children, title = null, props = {}) {
  if (!title) return children
  return (
    <StyledTooltip title={title} {...props}>
      {children}
    </StyledTooltip>
  )
}

export default wrapTooltip
