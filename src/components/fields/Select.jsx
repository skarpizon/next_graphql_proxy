import {
  CircularProgress,
  InputAdornment,
  MenuItem,
  useEventCallback
} from "@mui/material"
import { map } from "lodash-es"
import { useMemo } from "react"
import TextField from "./TextField"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import DangerousRoundedIcon from "@mui/icons-material/DangerousRounded"
import wrapTooltip from "@/utils/wrapTooltip"

const getAdornmentProps = ({ loading, success, error }) => {
  if (loading) {
    return {
      endAdornment: (
        <InputAdornment position="end">
          <CircularProgress size="1.2em" sx={{ mr: 2 }} />
        </InputAdornment>
      )
    }
  }
  if (success) {
    return {
      endAdornment: (
        <InputAdornment position="end">
          {wrapTooltip(
            <CheckCircleRoundedIcon
              size="1.2em"
              sx={{ mr: 2 }}
              color="success"
            />,
            success !== true ? success : null
          )}
        </InputAdornment>
      )
    }
  }
  if (error) {
    return {
      endAdornment: (
        <InputAdornment position="end">
          {wrapTooltip(
            <DangerousRoundedIcon size="1.2em" sx={{ mr: 2 }} color="error" />,
            error !== true ? error : null
          )}
        </InputAdornment>
      )
    }
  }
  return {}
}

function Select({
  label,
  value,
  onChange,
  options: propOptions,
  nullOption = undefined,
  getOptionValue = (o) => o.value,
  getOptionLabel = (o) => o.label,
  variant = "outlined",
  size = "small",
  loading,
  success,
  error,
  ...other
}) {
  const options = useMemo(
    () =>
      nullOption
        ? [
            { value: null, label: nullOption === true ? "-----" : nullOption },
            ...propOptions
          ]
        : propOptions,
    [propOptions, nullOption]
  )
  const InputProps = useMemo(
    () => getAdornmentProps({ loading, success, error }),
    [loading, success, error]
  )

  const handleChange = useEventCallback(
    (v) => (onChange ? onChange(v) : null),
    [onChange]
  )

  return (
    <TextField
      select
      {...other}
      value={value}
      label={label}
      variant={variant}
      size={size}
      onChange={handleChange}
      InputProps={InputProps}
      disabled={loading}
    >
      {map(options, (o) => (
        <MenuItem key={getOptionLabel(o)} value={getOptionValue(o)}>
          {getOptionLabel(o)}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default Select
