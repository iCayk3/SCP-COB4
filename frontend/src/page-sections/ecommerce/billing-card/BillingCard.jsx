import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// CUSTOM ICON COMPONENTS
import City from '@/icons/City';
import Delete from '@/icons/Delete';
import CheckmarkCircle from '@/icons/CheckmarkCircle';
// STYLED COMPONENT
import { StyledCard } from './styles';
// CUSTOM DATA TYPES

// ===================================================================

// ===================================================================

export default function BillingCard({
  address,
  selected,
  handleChange,
  handleDelete
}) {
  return <StyledCard onClick={handleChange} selected={selected}>
      <div>
        <div className="place">
          <City fontSize="small" />

          <Typography variant="body1" fontWeight={500} lineHeight={1}>
            {address.name}
          </Typography>
        </div>

        <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
          {address.addressLine1}, {address.postalCode} <br /> {address.city}, {address.country}
        </Typography>
      </div>

      {selected ? <div className="check-mark">
          <CheckmarkCircle />
        </div> : <IconButton onClick={e => {
      e.stopPropagation();
      handleDelete();
    }}>
          <Delete color="action" className="delete-icon" />
        </IconButton>}
    </StyledCard>;
}