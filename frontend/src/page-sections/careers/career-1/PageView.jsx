import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBox } from '@/components/flexbox';
// CUSTOM DUMMY DATA SET
import { CAREER_1_DATA } from './data';
export default function Career1PageView() {
  return <Box py={3}>
      <Typography variant="h6" fontWeight={500}>
        Career List
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{
      mb: 3
    }}>
        You sit down. You stare at your screen. The cursor blinks
      </Typography>

      <Grid container spacing={3}>
        {CAREER_1_DATA.map(({
        id,
        title,
        description,
        items
      }) => <Grid size={{
        md: 6,
        xs: 12
      }} key={id}>
            <Card className="p-3">
              <Typography variant="body1" fontWeight={500}>
                {title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{
            mb: 3
          }}>
                {description}
              </Typography>

              <CareerAccordion items={items} />

              <FlexBox alignItems="center" gap={2} mt={3}>
                <Button size="small" LinkComponent={Link} href="/career/apply">
                  Apply
                </Button>

                <Button size="small" variant="outlined" color="secondary">
                  Cancel
                </Button>
              </FlexBox>
            </Card>
          </Grid>)}
      </Grid>
    </Box>;
}
const CAREER_REQUIREMENTS = [{
  id: '1',
  text: 'Experience with JavaScript.'
}, {
  id: '2',
  text: 'Good time-management skills.'
}, {
  id: '3',
  text: 'Experience with React.'
}, {
  id: '4',
  text: 'Experience with HTML / CSS.'
}, {
  id: '5',
  text: 'Experience with REST API.'
}, {
  id: '6',
  text: 'Git knowledge is a plus.'
}];
function CareerAccordion({
  items
}) {
  return items.map((item, index) => <Accordion key={item} defaultExpanded={index === 0}>
      <AccordionSummary expandIcon={<ExpandMore />}>{item}</AccordionSummary>

      <AccordionDetails>
        <Box component="ul" pl={2}>
          {CAREER_REQUIREMENTS.map(({
          id,
          text
        }) => <Box key={id} component="li" pb={1}>
              {text}
            </Box>)}
        </Box>
      </AccordionDetails>
    </Accordion>);
}