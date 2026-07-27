import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
export const StyledAccordionSummary = styled(AccordionSummary)(({
  theme
}) => ({
  color: theme.palette.text.primary
}));
export const StyledAccordionDetails = styled(AccordionDetails)(({
  theme
}) => ({
  color: theme.palette.grey[700],
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[400]
  })
}));