import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Modal } from '@/components/modal';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Add from '@/icons/Add';
import ChevronLeft from '@/icons/ChevronLeft';
// CUSTOM PAGE SECTION COMPONENTS
import Stepper from '../Stepper';
import OrderSummery from '../order-summery';
import BillingCard from '../billing-card';
import BillingForm from '../billing-form/BillingForm';
// DUMMY CUSTOM DATA
import { addresses } from '@/data/addresses';
export default function BillingAddressPageView() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, []);
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);
  const handleSelectAddress = useCallback(id => {
    setSelectedAddress(id);
  }, []);
  const handleDeleteAddress = useCallback(id => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    console.log(id);
  }, []);
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* STEPPER SECTION */}
        <Grid size={12}>
          <Box mt={3} mb={1} maxWidth={700}>
            <Stepper stepNo={1} />
          </Box>
        </Grid>

        {/* BILLING ADDRESS LIST */}
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <FlexBetween flexWrap="wrap" gap={1.5} mb={3}>
            <Typography variant="h6">Billing & address</Typography>

            <Button variant="contained" startIcon={<Add />} onClick={handleOpenModal}>
              Add New Address
            </Button>
          </FlexBetween>

          <Modal open={openModal} handleClose={handleClose}>
            <BillingForm handleCancel={handleClose} />
          </Modal>

          <Stack gap={2} mb={2}>
            {addresses.map(address => <BillingCard key={address.id} address={address} selected={selectedAddress === address.id} handleDelete={() => handleDeleteAddress(address.id)} handleChange={() => handleSelectAddress(address.id)} />)}
          </Stack>

          <Button disableRipple variant="text" startIcon={<ChevronLeft />} onClick={() => navigate('/dashboard/cart')}>
            Back
          </Button>
        </Grid>

        {/* ORDER SUMMERY SECTION */}
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <OrderSummery buttonText="Payment" handleClick={() => navigate('/dashboard/payment')} />
        </Grid>
      </Grid>
    </div>;
}