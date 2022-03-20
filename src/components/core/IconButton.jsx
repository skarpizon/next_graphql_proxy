import { IconButton as MuiIconButton } from '@mui/material'
import wrapTooltip from '../../utils/wrapTooltip'

export default function IconButton ({
  icon: Icon,
  size = 'small',
  color = 'primary',
  tooltip,
  ...other
}) {

  return wrapTooltip((
    <MuiIconButton
      {...other}
      size={size}
      color={color}
    >
      <Icon fontSize='inherit' />
    </MuiIconButton>
  ), tooltip)
}