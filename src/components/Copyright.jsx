import { Typography } from "@mui/material"

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright @ "}
      JogurtOS&ensp;
      {new Date().getFullYear()}
    </Typography>
  )
}

export default Copyright
