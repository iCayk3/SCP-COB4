import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { ProductCard } from '@/components/product-cards/product-card-2';
// DATA
import { PRODUCTS } from '@/__fakeData__/products';
export default function Section4() {
  return <div className="py-12">
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{
        fontWeight: 500,
        mb: 3
      }}>
          You may also like
        </Typography>

        <Grid container spacing={3}>
          {PRODUCTS.slice(0, 6).map(product => <Grid size={{
          md: 4,
          sm: 6,
          xs: 12
        }} key={product.id}>
              <ProductCard id={product.id} name={product.name} price={product.price} image={product.image} />
            </Grid>)}
        </Grid>
      </Container>
    </div>;
}