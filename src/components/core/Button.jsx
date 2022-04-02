import { Button as MuiButton, CircularProgress, styled } from "@mui/material"
import { getFrom } from "@/utils/helpers"

const Box = styled("div", {
  shouldForwardProp: (prop) => prop !== "loading"
})(({ loading }) => {
  return {
    display: "inherit",
    alignItems: "inherit",
    opacity: loading ? 0 : 1
  }
})

export default function Button({
  loading,
  label,
  children,
  variant = "contained",
  size = "small",
  color = "primary",
  icon: Icon,
  ...other
}) {
  return (
    <MuiButton
      {...other}
      label={label}
      variant={variant}
      size={size}
      color={color}
    >
      {loading && (
        <CircularProgress
          size={getFrom(size, {
            small: 22,
            medium: 24,
            large: 27
          })}
          color="inherit"
          sx={{
            position: "absolute"
          }}
        />
      )}
      <Box loading={loading}>
        {Icon && (
          <Icon
            sx={{
              mr: 0.5,
              ml: getFrom(size, {
                small: -0.5,
                medium: -0.75,
                large: -1
              }),
              width: getFrom(size, {
                small: "0.8em",
                medium: "0.9em",
                large: "1em"
              }),
              height: getFrom(size, {
                small: "0.8em",
                medium: "0.9em",
                large: "1em"
              })
            }}
          />
        )}
        {(label && <span>{label}</span>) ?? children}
      </Box>
    </MuiButton>
  )
}
