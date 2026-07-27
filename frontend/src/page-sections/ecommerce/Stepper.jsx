import { useEffect, useState } from 'react';
// MUI
import Step from '@mui/material/Step';
import MuiStepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
const STEPS = ['Cart', 'Billing & address', 'Payment'];

// ============================================================================

// ============================================================================

export default function Stepper({
  stepNo
}) {
  const [activeStep, setActiveStep] = useState(stepNo);
  useEffect(() => {
    if (stepNo !== activeStep) setActiveStep(stepNo);
  }, [stepNo, activeStep]);
  return <MuiStepper alternativeLabel activeStep={activeStep} connector={<StepConnector />}>
      {STEPS.map(label => <Step key={label} sx={{
      padding: 0
    }}>
          <StepLabel>{label}</StepLabel>
        </Step>)}
    </MuiStepper>;
}