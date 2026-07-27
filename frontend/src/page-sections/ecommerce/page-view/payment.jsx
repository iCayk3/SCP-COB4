import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Edit from '@/icons/Edit';
import ChevronLeft from '@/icons/ChevronLeft';
// CUSTOM PAGE SECTION COMPONENTS
import Stepper from '../Stepper';
import OrderSummery from '../order-summery';
const PAYMENT_METHODS = {
  PAYPAL: 'paypal',
  CARD: 'card',
  CASH: 'cash'
};
export default function PaymentPageView() {
  const navigate = useNavigate();
  const [selectPaymentMethod, setSelectPaymentMethod] = useState('paypal');
  const handleChangePaymentMethod = useCallback(event => {
    setSelectPaymentMethod(event.target.value);
  }, []);
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* STEPPER SECTION */}
        <Grid size={12}>
          <Box mt={3} maxWidth={700}>
            <Stepper stepNo={2} />
          </Box>
        </Grid>

        {/* PAYMENT METHOD SELECTION FORM */}
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <Card className="p-3">
            <Typography variant="h6">Payment Method</Typography>

            {/* PAYPAL METHOD */}
            <FlexBox alignItems="center" gap={1} mt={2}>
              <Radio value={PAYMENT_METHODS.PAYPAL} onChange={handleChangePaymentMethod} checked={selectPaymentMethod === PAYMENT_METHODS.PAYPAL} />

              <img src="/static/payment/paypal-text.svg" alt="Paypal" />
            </FlexBox>

            <Divider sx={{
            my: 2
          }} />

            {/* CREDIT CARD METHOD */}
            <FlexBox alignItems="center" gap={1}>
              <Radio value={PAYMENT_METHODS.CARD} onChange={handleChangePaymentMethod} checked={selectPaymentMethod === PAYMENT_METHODS.CARD} />

              <FlexBetween flexGrow={1}>
                <Typography variant="body2" fontWeight={500}>
                  Credit or debit card
                </Typography>

                <FlexBox gap={1}>
                  {['Visa', 'MasterCard', 'AmericanExpress'].map(card => <img key={card} src={`/static/payment/${card}.svg`} alt={`${card} Card`} />)}
                </FlexBox>
              </FlexBetween>
            </FlexBox>

            {selectPaymentMethod === PAYMENT_METHODS.CARD && <CreditCardForm />}

            <Divider sx={{
            my: 2
          }} />

            {/* CASH ON DELIVERY METHOD */}
            <FlexBox alignItems="center" gap={1}>
              <Radio value={PAYMENT_METHODS.CASH} onChange={handleChangePaymentMethod} checked={selectPaymentMethod === PAYMENT_METHODS.CASH} />

              <Typography variant="body2" fontWeight={500}>
                Cash on Delivery
              </Typography>
            </FlexBox>
          </Card>

          <Box mt={2}>
            <Button disableRipple variant="text" startIcon={<ChevronLeft />} onClick={() => navigate('/dashboard/billing-address')}>
              Back
            </Button>
          </Box>
        </Grid>

        {/* BILLING ADDRESS & ORDER SUMMERY SECTION */}
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          {/* BILLING ADDRESS */}
          <BillingAddress />

          {/* ORDER SUMMERY */}
          <OrderSummery buttonText="Place Order" handleClick={() => navigate('/dashboard/payment-complete')} />
        </Grid>
      </Grid>
    </div>;
}
const BillingAddress = memo(function () {
  return <Card sx={{
    mb: 3,
    p: 3
  }}>
      <FlexBetween mb={1.5}>
        <Typography variant="h6">Billing Address</Typography>
        <IconButton>
          <Edit fontSize="small" />
        </IconButton>
      </FlexBetween>

      <Typography variant="body2" sx={{
      mb: 0.5,
      fontWeight: 500,
      span: {
        color: 'text.secondary'
      }
    }}>
        Office UI lib <span>(Home)</span>
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Ap #285-7193 Ullamcorper Avenue <br /> Amesbury HI 93373 <br /> US
      </Typography>
    </Card>;
});
const CreditCardForm = memo(function () {
  return <Box mt={2} mb={3}>
      <Grid container spacing={2}>
        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField label="Card Holder" fullWidth />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField label="Card Number" fullWidth />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField label="Exp Date" fullWidth />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField label="CVC" fullWidth />
        </Grid>
      </Grid>
    </Box>;
});