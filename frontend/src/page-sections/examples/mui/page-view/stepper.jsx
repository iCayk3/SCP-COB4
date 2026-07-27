import { Fragment, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepContent from '@mui/material/StepContent';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// MUI ICON COMPONENT
import Check from '@mui/icons-material/Check';
// CUSTOM COMPONENTS
import { Block } from '@/components/block';
import { FlexBox } from '@/components/flexbox';
import ComponentPageLayout from '../../ComponentPageLayout';

// STYLED COMPONENTS
const CustomConnector = styled(StepConnector)(({
  theme
}) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0'
  }
}));
const CustomStepIconRoot = styled('div')(({
  theme,
  ownerState
}) => ({
  color: '#eaeaf0',
  height: 22,
  display: 'flex',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[300]
  }),
  ...(ownerState.active && {
    color: theme.palette.primary.main
  }),
  '& .QontoStepIcon-completedIcon': {
    zIndex: 1,
    fontSize: 18,
    color: theme.palette.primary.main
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}));
const CustomStepIcon = ({
  active,
  completed,
  className
}) => <CustomStepIconRoot ownerState={{
  active
}} className={className}>
    {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
  </CustomStepIconRoot>;
const linear = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
const steps = [{
  label: 'Select campaign settings',
  description: `For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.`
}, {
  label: 'Create an ad group',
  description: 'An ad group contains one or more ads which target a shared set of keywords.'
}, {
  label: 'Create an ad',
  description: `Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.`
}];
export default function MuiStepperPageView() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const isStepOptional = step => step === 1;
  const isStepSkipped = step => skipped.has(step);
  const handleReset = () => setActiveStep(0);
  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // VERTICAL STEPPER
  const [verticalStep, setVerticalStep] = useState(0);
  const handleVerticalReset = () => setVerticalStep(0);
  const handleVerticalNext = () => setVerticalStep(state => state + 1);
  const handleVerticalBack = () => setVerticalStep(state => state - 1);
  const stepperNavigation = () => {
    return activeStep === linear.length ? <Fragment>
        <Box sx={theme => ({
        padding: 3,
        marginTop: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.grey[50],
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[800]
        })
      })}>
          <Typography variant="body2" fontWeight={500}>
            All steps completed - you&apos;re finished
          </Typography>
        </Box>

        <FlexBox pt={2}>
          <Box flex="1 1 auto" />
          <Button onClick={handleReset}>Reset</Button>
        </FlexBox>
      </Fragment> : <Fragment>
        <Box sx={theme => ({
        padding: 3,
        marginTop: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.grey[50],
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[800]
        })
      })}>
          <Typography variant="body2" fontWeight={500}>
            Step {activeStep + 1}
          </Typography>
        </Box>

        <FlexBox pt={2}>
          <Button variant="text" color="inherit" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>

          <Box flex="1 1 auto" />

          {isStepOptional(activeStep) && <Button variant="text" color="inherit" onClick={handleSkip} sx={{
          mr: 1
        }}>
              Skip
            </Button>}

          <Button onClick={handleNext}>
            {activeStep === linear.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </FlexBox>
      </Fragment>;
  };
  return <ComponentPageLayout title="Stepper">
      {/* HORIZONTAL LINEAR */}
      <Block bgTransparent title="Horizontal Linear">
        <Stepper activeStep={activeStep}>
          {linear.map((label, index) => {
          const completed = isStepSkipped(index) ? false : undefined;
          const optional = isStepOptional(index) ? <Typography variant="body2">Optional</Typography> : undefined;
          return <Step key={label} completed={completed}>
                <StepLabel optional={optional}>{label}</StepLabel>
              </Step>;
        })}
        </Stepper>

        {stepperNavigation()}
      </Block>

      {/* ALTERNATIVE LABEL */}
      <Block bgTransparent title="Alternative Label">
        <Stepper alternativeLabel activeStep={activeStep}>
          {linear.map((label, index) => {
          const completed = isStepSkipped(index) ? false : undefined;
          const optional = isStepOptional(index) ? <Typography variant="body2">Optional</Typography> : undefined;
          return <Step key={label} completed={completed}>
                <StepLabel optional={optional}>{label}</StepLabel>
              </Step>;
        })}
        </Stepper>

        {stepperNavigation()}
      </Block>

      {/* CUSTOMIZED STEPPER */}
      <Block bgTransparent title="Customized Stepper">
        <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
          {linear.map(label => <Step key={label}>
              <StepLabel slots={{
            stepIcon: CustomStepIcon
          }}>{label}</StepLabel>
            </Step>)}
        </Stepper>

        {stepperNavigation()}
      </Block>

      {/* VERTICAL STEPPER */}
      <Block bgTransparent title="Vertical Stepper">
        <Stepper activeStep={verticalStep} orientation="vertical">
          {steps.map((step, index) => <Step key={step.label}>
              <StepLabel optional={index === 2 ? <Typography variant="body2">Last step</Typography> : null}>
                {step.label}
              </StepLabel>

              <StepContent>
                <Typography variant="body2">{step.description}</Typography>

                <Stack mt={3} direction="row" gap={1}>
                  <Button size="small" onClick={handleVerticalNext}>
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>

                  <Button size="small" variant="text" color="inherit" disabled={index === 0} onClick={handleVerticalBack}>
                    Back
                  </Button>
                </Stack>
              </StepContent>
            </Step>)}
        </Stepper>

        {verticalStep === steps.length && <Box sx={theme => ({
        padding: 3,
        marginTop: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.grey[50],
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[800]
        })
      })}>
            <Typography variant="body2" fontWeight={500} sx={{
          mb: 2
        }}>
              All steps completed - you&apos;re finished
            </Typography>

            <Button size="small" onClick={handleVerticalReset}>
              Reset
            </Button>
          </Box>}
      </Block>
    </ComponentPageLayout>;
}