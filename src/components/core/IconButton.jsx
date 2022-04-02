import { IconButton as MuiIconButton } from "@mui/material"
import wrapTooltip from "@/utils/wrapTooltip"
import { forwardRef } from "react"

function IconButton(
  { icon: Icon, size = "small", color = "primary", tooltip, ...other },
  ref
) {
  return wrapTooltip(
    <MuiIconButton ref={ref} {...other} size={size} color={color}>
      <Icon fontSize="inherit" />
    </MuiIconButton>,
    tooltip
  )
}

export default forwardRef(IconButton)
