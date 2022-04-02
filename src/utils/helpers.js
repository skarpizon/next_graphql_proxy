import { get, map } from "lodash-es"

export function getApiUrl(url, id, after) {
  return `${url}${id ? `/${id}` : ""}${after ? `/${after}` : ""}`
}

export function getFrom(value, obj) {
  return get(obj, value) ?? get(obj, "default")
}

const bytesNext = 1024
const bytesTip = {
  1: " KB",
  2: " MB",
  3: " GB",
  4: " TB"
}

export const byteFormatter = ({ value }) => byteToReadable(value)

export function byteToReadable(bytes = 0) {
  let result = bytes
  let next = result / bytesNext
  let i = 0
  do {
    result = next
    i++
    next = result / bytesNext
  } while (next > 0.099 && bytesTip[i + 1])
  return result.toFixed(1) + bytesTip[i]
}

export const getTableColumns = (fields) =>
  map(fields, ({ label, ...other }) => ({ headerName: label, ...other }))
