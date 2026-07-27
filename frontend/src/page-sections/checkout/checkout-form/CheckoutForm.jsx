import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import CardForm from './CardForm';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import CircleOutlined from '@/icons/CircleOutlined';
import CheckCircleOutline from '@/icons/CheckCircleOutline';
// STYLED COMPONENTS
import { CardWrapper, StyledCard } from './styles';

// ==============================================================

// ==============================================================

export default function CheckoutForm({
  handleSelectedPayment,
  activeMethod
}) {
  return <StyledCard>
      <Grid container spacing={3}>
        {/* BILLING ADDRESS FORM */}
        <Grid size={{
        lg: 6,
        xs: 12
      }}>
          <Typography variant="h6" fontSize={18}>
            Billing Address
          </Typography>

          <Stack spacing={2} mt={3}>
            <TextField size="medium" placeholder="Person Name" />
            <TextField size="medium" placeholder="Email Address" />
            <TextField size="medium" placeholder="Phone No." />
            <TextField size="medium" placeholder="Address" />
          </Stack>
        </Grid>

        {/* PAYMENT METHOD SELECTION */}
        <Grid size={{
        lg: 6,
        xs: 12
      }}>
          <Typography variant="h6" fontSize={18}>
            Payment Method
          </Typography>

          <Stack spacing={2} mt={3}>
            {/* PAYPAL METHOD */}
            <CardWrapper active={activeMethod('paypal')} onClick={() => handleSelectedPayment('paypal')} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
              <div className="item-center">
                {activeMethod('paypal') ? <CheckCircleOutline color="primary" /> : <CircleOutlined />}

                <Typography variant="body2" fontWeight={500}>
                  PayPal
                </Typography>
              </div>

              <img width={20} src="/static/payment/paypal.svg" alt="paypal" />
            </CardWrapper>

            {/* CREDIT CARD METHOD */}
            <CardWrapper active={activeMethod('card')} onClick={() => handleSelectedPayment('card')}>
              <FlexBetween>
                <div className="item-center">
                  {activeMethod('card') ? <CheckCircleOutline color="primary" /> : <CircleOutlined />}

                  <Typography variant="body2" fontWeight={500}>
                    Credit/Debit
                  </Typography>
                </div>

                <div className="item-center">
                  <img src="/static/payment/master-card.svg" width={25} alt="Master Card" />
                  <img src="/static/payment/Visa.svg" width={25} alt="Visa Card" />
                </div>
              </FlexBetween>

              {activeMethod('card') && <CardForm />}
            </CardWrapper>
          </Stack>
        </Grid>
      </Grid>
    </StyledCard>;
}