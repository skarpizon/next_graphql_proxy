import { forwardRef } from "react"
import { DataGrid } from "@mui/x-data-grid"
import CellWithTooltip from "../support/TableCellWithTooltip"

const components = {
  Cell: CellWithTooltip
}

function Table({ data, columns, tooltips = false, ...other }, ref) {
  if (!data) return null
  return (
    <DataGrid
      {...other}
      ref={ref}
      rows={data}
      columns={columns}
      autoHeight
      disableSelectionOnClick
      {...(tooltips ? { components } : {})}
    />
  )
}

export default forwardRef(Table)
