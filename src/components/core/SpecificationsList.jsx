import React, { useMemo } from "react"
import { Paper, styled, Typography } from "@mui/material"
import { map } from "lodash-es"
import { forEach } from "lodash-es"
import { isEmpty } from "lodash-es"
import { get } from "lodash-es"
import { isNil } from "lodash-es"

const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  rowGap: theme.spacing(1),
  columnGap: theme.spacing(2)
}))

const Header = styled("div")({
  fontWeight: "bold"
})

function getSpecs(options, data, skipNulls) {
  const items = []
  forEach(options, ({ field, alt, label, render }) => {
    let fieldValue = null
    if (render && data) {
      fieldValue = render({ ...data, value: get(data, field) })
    } else {
      fieldValue = get(data, field) ?? get(data, alt)
    }
    if (!skipNulls && isNil(fieldValue)) fieldValue = "---"
    if (!isNil(fieldValue)) {
      items.push({ label, value: fieldValue })
    }
  })
  return items
}

function SpecificationsList({ title, fields, data, skipNulls = false }) {
  const items = useMemo(
    () => getSpecs(fields, data, skipNulls),
    [fields, data, skipNulls]
  )
  if (isEmpty(items)) {
    return null
  }

  const content = (
    <Container>
      {map(items, ({ label, value }, index) => (
        <React.Fragment key={label || index}>
          <Header>{label}:</Header>
          <div>{value}</div>
        </React.Fragment>
      ))}
    </Container>
  )

  return title ? (
    <Paper spacing={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {content}
    </Paper>
  ) : (
    content
  )
}

export default SpecificationsList
