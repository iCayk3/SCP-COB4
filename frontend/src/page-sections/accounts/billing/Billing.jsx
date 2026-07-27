import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import HistoryTable from './components/HistoryTable';
import NewAddressCard from './components/NewAddressCard';
import BillingAddress from './components/BillingAddress';
import PaymentMethodsTable from './components/PaymentMethodsTable';
import BillingAddressListItem from './components/BillingAddressListItem';
export default function Billing() {
  return <Card>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Billing
      </Typography>

      <Divider />

      {/* BILLING DETAILS */}
      <BillingAddress />

      {/* PAYMENT METHODS */}
      <PaymentMethodsTable />

      {/* BILLING ADDRESS */}
      <div className="p-3">
        <Typography variant="body2" fontWeight={500} mb={3}>
          Billing Address
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{
          md: 6,
          xs: 12
        }}>
            <BillingAddressListItem />
          </Grid>

          <Grid size={{
          md: 6,
          xs: 12
        }}>
            <NewAddressCard />
          </Grid>
        </Grid>
      </div>

      {/* BILLING HISTORY */}
      <HistoryTable />
    </Card>;
}