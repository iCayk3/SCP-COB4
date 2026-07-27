import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns/format';
// MUI
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { TableMoreMenuItem, TableMoreMenu } from '@/components/table';
// CUSTOM DATA TYPES

// STYLED COMPONENTS
const InvoiceName = styled(Typography)(({
  theme
}) => ({
  fontWeight: 500,
  marginBottom: '0.25rem',
  color: theme.palette.text.primary,
  ':hover': {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));

// ==============================================================

// ==============================================================

export default function InvoiceTableRow(props) {
  const {
    invoice,
    isSelected,
    handleDeleteInvoice,
    handleSelectRow
  } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = useCallback(event => {
    setOpenMenuEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => setOpenMenuEl(null), []);
  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, invoice.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar src={invoice.avatar} alt={invoice.name} variant="rounded" />

          <div>
            <InvoiceName variant="body2">{invoice.name}</InvoiceName>

            <Typography variant="body2" fontSize={13}>
              {invoice.id.substring(0, 15)}
            </Typography>
          </div>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">{invoice.email}</TableCell>

      <TableCell padding="normal">
        <Typography variant="body2" color="text.secondary">
          {format(invoice.date, 'MMM dd, yyyy')}
        </Typography>
      </TableCell>

      <TableCell padding="normal">
        <Chip size="small" label={invoice.status} color={invoice.status === 'Complete' ? 'success' : 'error'} />
      </TableCell>

      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseMenu}>
          <TableMoreMenuItem title="View" Icon={RemoveRedEye} handleClick={() => {
          handleCloseMenu();
          navigate('/dashboard/invoice-details');
        }} />

          <TableMoreMenuItem title="Delete" Icon={DeleteOutline} handleClick={() => {
          handleCloseMenu();
          handleDeleteInvoice(invoice.id);
        }} />
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
}