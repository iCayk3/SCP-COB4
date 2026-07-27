import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns/format';
// MUI
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import Edit from '@mui/icons-material/Edit';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { TableMoreMenuItem, TableMoreMenu } from '@/components/table';
// CUSTOM DATA TYPES

// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// STYLED COMPONENTS
const ProductName = styled(Typography)(({
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

export default function ProductTableRow({
  product,
  isSelected,
  handleSelectRow,
  handleDeleteProduct
}) {
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = useCallback(event => {
    setOpenMenuEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setOpenMenuEl(null);
  }, []);
  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, product.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar variant="rounded" alt={product.name} src={product.image} />

          <div>
            <ProductName variant="body2">{product.name}</ProductName>

            <Typography variant="body2" fontSize={13}>
              {product.category}
            </Typography>
          </div>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">{format(new Date(product.createdAt), 'dd MMM yyyy')}</TableCell>

      <TableCell padding="normal" sx={{
      ...(product.stock === 0 && {
        color: 'error.main'
      })
    }}>
        {product.stock}
      </TableCell>

      <TableCell padding="normal">{currency(product.price)}</TableCell>

      <TableCell padding="normal">
        {product.published ? <Chip label="Published" /> : <Chip label="Draft" color="secondary" />}
      </TableCell>

      <TableCell padding="normal" align="right">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseMenu}>
          <TableMoreMenuItem Icon={RemoveRedEye} title="View" handleClick={() => {
          handleCloseMenu();
          navigate('/dashboard/product-details');
        }} />
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={() => {
          handleCloseMenu();
          navigate('/dashboard/create-product');
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
          handleCloseMenu();
          handleDeleteProduct(product.id);
        }} />
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
}