import { GridCell } from "@mui/x-data-grid"
import wrapTooltip from "@/utils/wrapTooltip"

const tooltipProps = { spanWrap: true, placement: "bottom-start" }

function CellWithTooltip(props) {
  const { formattedValue, children, ...other } = props

  return (
    <GridCell {...other}>
      {children
        ? children
        : wrapTooltip(
            formattedValue,
            typeof formattedValue !== "boolean" && formattedValue,
            tooltipProps
          )}
    </GridCell>
  )
}

export default CellWithTooltip
