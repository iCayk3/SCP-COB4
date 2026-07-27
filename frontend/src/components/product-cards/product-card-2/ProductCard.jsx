import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Add from '@mui/icons-material/Add';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
// CUSTOM COMPONENT
import { Link } from '@/components/link';
// STYLED COMPONENT
import { StyledRoot } from './styles';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
export function ProductCard({
  id,
  image,
  name,
  price
}) {
  return <StyledRoot>
      <div className="img-wrapper">
        <img alt="product" width="100%" src={image} />

        <div className="hover-actions">
          <IconButton className="view" LinkComponent={Link} href={`/products/${id}`}>
            <VisibilityOutlined />
          </IconButton>

          <IconButton className="cart">
            <ShoppingCartOutlined />
          </IconButton>
        </div>
      </div>

      <div className="content-root">
        <div>
          <Link href={`/products/${id}`}>
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              {name}
            </Typography>
          </Link>

          <Typography variant="body2" fontWeight={600}>
            {currency(price)}
          </Typography>
        </div>

        <Button variant="outlined" color="secondary">
          <Add />
        </Button>
      </div>
    </StyledRoot>;
}