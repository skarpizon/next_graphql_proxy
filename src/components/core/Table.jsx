import { forwardRef } from 'react'
import { DataGrid } from '@mui/x-data-grid'

function Table ({
  data,
  columns,
  ...other
}, ref) {

  return (
    <DataGrid
      {...other}
      ref={ref}
      rows={data}
      columns={columns}
      autoHeight
      disableSelectionOnClick
    />
  )
}


export default forwardRef(Table)