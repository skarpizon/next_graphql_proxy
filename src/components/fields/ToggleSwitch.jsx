import { FormControlLabel, Switch, useEventCallback } from "@mui/material"

function ToggleSwitch({ label, value, onChange, ...other }) {
  const handleChange = useEventCallback(
    (e) => (onChange ? onChange(Boolean(e.target.checked)) : null),
    [onChange]
  )

  return (
    <FormControlLabel
      label={label}
      control={
        <Switch checked={Boolean(value)} onChange={handleChange} {...other} />
      }
    />
  )
}

export default ToggleSwitch
