import React, { forwardRef } from "react"
import { get, map } from "lodash-es"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { isEmpty } from "lodash-es"

function TableBasic({ data, columns }, ref) {
  if (!data) return null
  return (
    <TableContainer ref={ref} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {map(columns, (column) => (
              <TableCell key={column.field}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(data) ? (
            <TableRow>
              <TableCell align="center" colSpan={columns.length}>
                No data
              </TableCell>
            </TableRow>
          ) : (
            map(data, (item, index) => (
              <TableRow
                key={item?.id ?? `ix_${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {map(columns, ({ field, valueFormatter }) => (
                  <TableCell key={field}>
                    {valueFormatter
                      ? valueFormatter({ ...item, value: get(item, field) })
                      : get(item, field, "---")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default forwardRef(TableBasic)
