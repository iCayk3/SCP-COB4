import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Counter } from '@/components/counter';
import { FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Clear from '@/icons/Clear';
// STYLED COMPONENTS
import { BodyTableCell } from './styles';
// CUSTOM UTILS
import { currency } from '@/utils/currency';
const SPAN_COLOR = {
  span: {
    color: 'text.primary'
  }
};

// ==============================================================

// ==============================================================

export default function CartItem({
  item,
  onRemoveItem,
  onUpdateQuantity
}) {
  return <TableRow>
      <BodyTableCell>
        <FlexBox gap={1.5} alignItems="center">
          <Avatar src={item.image} sx={{
          width: 65,
          height: 65,
          borderRadius: '10%'
        }} />

          <Stack spacing={0.3}>
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {item.name}
            </Typography>

            <Typography variant="body2" sx={SPAN_COLOR}>
              Color: <span>{item.color}</span>
            </Typography>

            <Typography variant="body2" sx={SPAN_COLOR}>
              Size: <span>{item.size}</span>
            </Typography>
          </Stack>
        </FlexBox>
      </BodyTableCell>

      <BodyTableCell>
        <Counter count={item.quantity} onChange={value => onUpdateQuantity(item.id, value)} />

        <Typography variant="body2" sx={{
        mt: 0.5,
        fontSize: 12
      }}>
          Available: {item.available}
        </Typography>
      </BodyTableCell>

      <BodyTableCell>
        <Typography variant="body2" fontWeight={500} color="text.primary">
          {currency(item.price * item.quantity)}
        </Typography>
      </BodyTableCell>

      <BodyTableCell>
        <IconButton onClick={() => onRemoveItem(item.id)}>
          <Clear sx={{
          color: 'text.secondary'
        }} />
        </IconButton>
      </BodyTableCell>
    </TableRow>;
}