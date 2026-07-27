import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { FlexRowAlign } from '@/components/flexbox';
export function TableDataNotFound() {
  return <TableRow>
      <TableCell colSpan={7}>
        <FlexRowAlign m={2} fontSize={18} minHeight={300} fontWeight={700} borderRadius={2} bgcolor="action.selected">
          Data Not Found!
        </FlexRowAlign>
      </TableCell>
    </TableRow>;
}