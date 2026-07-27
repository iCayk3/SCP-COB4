import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM ICON COMPONENTS
import Edit from '@/icons/Edit';
import Delete from '@/icons/Delete';
import HomeOutlined from '@/icons/HomeOutlined';

// CUSTOM STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: '1rem',
  display: 'flex',
  boxShadow: 'none',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${theme.palette.divider}`,
  '& .content': {
    maxWidth: '60%'
  }
}));
export default function BillingAddressListItem() {
  return <StyledRoot>
      <div className="content">
        <Stack direction="row" alignItems="center" spacing={1}>
          <HomeOutlined sx={{
          color: 'grey.400',
          fontSize: 18
        }} />
          <Typography variant="body2" fontWeight={500}>
            Home
          </Typography>
        </Stack>

        <Typography variant="body2" mt={1} color="grey.500">
          Ap #285-7193 Ullamcorper Avenue Amesbury HI 93373 US
        </Typography>
      </div>

      <Stack direction="row">
        <IconButton>
          <Edit fontSize="small" sx={{
          color: 'text.secondary'
        }} />
        </IconButton>

        <IconButton>
          <Delete fontSize="small" sx={{
          color: 'text.secondary'
        }} />
        </IconButton>
      </Stack>
    </StyledRoot>;
}