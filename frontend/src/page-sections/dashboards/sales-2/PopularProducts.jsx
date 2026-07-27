import { format } from 'date-fns/format';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBox } from '@/components/flexbox';

// STYLED COMPONENTS
const HeadCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 500,
  paddingBottom: '.5rem',
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:first-of-type': {
    paddingLeft: '1.5rem'
  }
}));
const BodyCell = styled(TableCell)(() => ({
  paddingBlock: '.75rem',
  '&:first-of-type': {
    paddingLeft: '1.5rem'
  }
}));
const BodyTableRow = styled(TableRow)(({
  theme
}) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none'
  },
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shortest,
    easing: theme.transitions.easing.easeInOut
  }),
  ':hover': {
    backgroundColor: theme.palette.action.hover
  }
}));
export default function PopularProducts() {
  const {
    t
  } = useTranslation();
  return <Card>
      <Typography variant="h6" sx={{
      fontSize: 16,
      mt: 3,
      mb: 2,
      mx: 3
    }}>
        {t('Popular Products')}
      </Typography>

      <Scrollbar>
        <Table sx={{
        minWidth: 700
      }}>
          <TableHead>
            <TableRow>
              <HeadCell>Product</HeadCell>
              <HeadCell>Date</HeadCell>
              <HeadCell>Category</HeadCell>
              <HeadCell>Brand</HeadCell>
              <HeadCell>Price</HeadCell>
              <HeadCell align="center">Status</HeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {PRODUCTS.map(item => <BodyTableRow key={item.id}>
                <BodyCell>
                  <FlexBox alignItems="center" gap={2}>
                    <Avatar src={item.image} alt={item.name} variant="rounded" />
                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                      {item.name}
                    </Typography>
                  </FlexBox>
                </BodyCell>

                <BodyCell>{format(item.date, 'MMM dd, yyyy')}</BodyCell>
                <BodyCell>{item.category}</BodyCell>
                <BodyCell>{item.brand}</BodyCell>
                <BodyCell>${item.price}</BodyCell>

                <BodyCell align="center">
                  <Chip size="small" label={item.status} color={item.status === 'Available' ? 'success' : 'error'} />
                </BodyCell>
              </BodyTableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}
const PRODUCTS = [{
  id: 1,
  name: 'Nike Air max 170',
  image: '/static/products/shoe-1.png',
  date: new Date(),
  price: 654,
  category: 'Shoes',
  status: 'Available',
  brand: 'Nike'
}, {
  id: 2,
  name: 'Cactus Plant',
  image: '/static/products/bonsai.png',
  date: new Date(),
  price: 654,
  category: 'Tree',
  status: 'Available',
  brand: 'Bonsai'
}, {
  id: 3,
  name: 'Minimal Pot',
  image: '/static/products/airbud.png',
  date: new Date(),
  price: 654,
  category: 'Accessories',
  status: 'Out of Stock',
  brand: 'Ikea'
}, {
  id: 4,
  name: 'Adidas Blaze',
  image: '/static/products/shoe-2.png',
  date: new Date(),
  price: 654,
  category: 'Shoes',
  status: 'Out of Stock',
  brand: 'Adidas'
}];