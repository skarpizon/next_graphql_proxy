import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Button from "./core/Button"
import Link from "./core/Link"

function ErrorPage({ mainText = "Something went wrong", subText = null }) {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography variant="h2" gutterBottom>
          {mainText}
        </Typography>
        {Boolean(subText) && <Typography variant="h4">{subText}</Typography>}
        <Link href="/">
          <Button variant="outlined" label="Go to main" sx={{ mt: 4 }} />
        </Link>
      </Box>
    </Container>
  )
}

export default ErrorPage
