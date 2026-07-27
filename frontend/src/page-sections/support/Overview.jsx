import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENT
import ExpandMore from '@mui/icons-material/ExpandMore';
// CUSTOM COMPONENTS
import { MoreButton } from '@/components/more-button';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM DUMMY DATA
import { OVERVIEW_DATA, SUPPORT_1, SUPPORT_2, SUPPORT_3 } from './data';

// STYLED COMPONENTS
const StyledChip = styled(Chip)(({
  theme
}) => ({
  fontSize: 12,
  marginLeft: 8,
  borderRadius: 4,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
const ListItem = styled('li')(({
  theme
}) => ({
  fontSize: 14,
  paddingBottom: 8,
  color: theme.palette.text.secondary,
  '::marker': {
    fontSize: '140%',
    color: theme.palette.text.secondary
  }
}));
const ListGroup = styled('div')(({
  theme
}) => ({
  gap: 16,
  marginTop: 16,
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  ul: {
    paddingLeft: '1.5rem'
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr 1fr'
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr'
  }
}));
export default function Overview() {
  return <Grid container spacing={3}>
      {OVERVIEW_DATA.map(({
      id,
      title,
      items
    }) => <Grid size={{
      md: 6,
      xs: 12
    }} key={id}>
          <Card className="p-3">
            <FlexBetween mb={3}>
              <Typography variant="body1" fontWeight={500}>
                {title}
              </Typography>

              <MoreButton size="small" />
            </FlexBetween>

            {items.map((item, i) => <Accordion key={item.id} defaultExpanded={i === 0}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  {item.title}{' '}
                  {item?.tag && <StyledChip size="small" color="default" label={item.tag} />}
                </AccordionSummary>

                <AccordionDetails>
                  By Uko to save tons and more to time money projects are listed and outstanding.
                </AccordionDetails>
              </Accordion>)}
          </Card>
        </Grid>)}

      <Grid size={12}>
        <Card sx={{
        position: 'relative',
        minHeight: 300,
        p: 3
      }}>
          <Box position="absolute" right={0} bottom={0}>
            <img src="/static/illustration/support-2.svg" alt="" />
          </Box>

          <Typography variant="body1" fontWeight={500}>
            Products Documentations
          </Typography>

          <ListGroup>
            <ul>
              {SUPPORT_1.map(item => <ListItem key={item}>{item}</ListItem>)}
            </ul>

            <ul>
              {SUPPORT_2.map(item => <ListItem key={item}>{item}</ListItem>)}
            </ul>

            <ul>
              {SUPPORT_3.map(item => <ListItem key={item}>{item}</ListItem>)}
            </ul>
          </ListGroup>
        </Card>
      </Grid>
    </Grid>;
}