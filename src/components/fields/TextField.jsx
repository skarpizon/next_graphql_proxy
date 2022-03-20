import { TextField as MuiTextField, useEventCallback } from '@mui/material'


export default function TextField ({
  label,
  value,
  onChange,
  variant = 'outlined',
  size = 'small',
  ...other
}) {

  const handleChange = useEventCallback(
    (e) => onChange ? onChange(e.target.value) : null,
    [onChange]
  )

  return (
    <MuiTextField
      {...other}
      value={value}
      label={label}
      variant={variant}
      size={size}
      onChange={handleChange}
    />
  )
}