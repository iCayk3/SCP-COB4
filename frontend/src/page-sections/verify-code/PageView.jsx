import { useCallback, useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
// MUI
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
// CUSTOM COMPONENTS
import { GradientBackground } from '@/components/gradient-background';
// STYLED COMPONENTS
import { MainContent } from './styles';
export default function VerifyCodePageView() {
  const [otp, setOtp] = useState('534352');
  const handleSubmit = useCallback(() => {
    console.log(otp);
  }, [otp]);
  return <GradientBackground>
      <Container>
        <MainContent>
          <div className="img-wrapper">
            <img src="/static/pages/email.svg" alt="email" width="100%" />
          </div>

          <h6 className="title">Check your email!</h6>

          <p className="description">
            Please check your email inbox for a 5-digit verification code we have sent to your
            registered email address. Enter the code in the field below to confirm your email and
            complete the verification process.
          </p>

          <div className="form-wrapper">
            <MuiOtpInput value={otp} onChange={setOtp} length={6} TextFieldsProps={{
            size: 'medium',
            sx: {
              marginBottom: '2rem'
            }
          }} />

            <Button size="large" fullWidth onClick={handleSubmit}>
              Verify
            </Button>
          </div>

          <p className="have-code">
            Don’t have a code?{' '}
            <span className="resend" onClick={() => {}}>
              Resend code
            </span>
          </p>

          <Button variant="text" disableRipple startIcon={<ChevronLeftRounded />}>
            Return to sign in
          </Button>
        </MainContent>
      </Container>
    </GradientBackground>;
}