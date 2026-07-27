import Grid from '@mui/material/Grid';
// CUSTOM COMPONENTS
import PricingCard from './PricingCard';
// STYLED COMPONENT
import { StyledContainer } from './styles';
// CUSTOM DUMMY DATA
import { pricingList } from './data';
export default function Section2() {
  return <StyledContainer maxWidth="lg">
      <Grid container spacing={4}>
        {pricingList.map(item => <Grid size={{
        md: 4,
        sm: 6,
        xs: 12
      }} key={item.id}>
            <PricingCard icon={item.icon} price={item.price} title={item.title} popular={item.popular} features={item.features} />
          </Grid>)}
      </Grid>
    </StyledContainer>;
}