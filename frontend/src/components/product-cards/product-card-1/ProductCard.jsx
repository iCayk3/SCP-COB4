import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// CUSTOM ICON COMPONENTS
import Edit from '@/icons/Edit';
import Delete from '@/icons/Delete';
// STYLED COMPONENTS
import { ImageWrapper, StyledIconButton } from './styles';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// CUSTOM DATA TYPES

export function ProductCard({
  product,
  handleDelete
}) {
  const {
    image,
    name,
    price
  } = product;
  return <Card sx={{
    position: 'relative'
  }}>
      <ImageWrapper>
        <CardMedia width="100%" height="100%" component="img" alt="Product Image" image={image} />

        <div className="hover-actions">
          <StyledIconButton>
            <Edit className="icon" />
          </StyledIconButton>

          <StyledIconButton onClick={handleDelete}>
            <Delete className="icon" />
          </StyledIconButton>
        </div>
      </ImageWrapper>

      <CardContent sx={{
      textAlign: 'center',
      '&:last-child': {
        pb: 2
      }
    }}>
        <Typography variant="body2" fontWeight={500}>
          {name}
        </Typography>

        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {currency(price)}
        </Typography>
      </CardContent>
    </Card>;
}