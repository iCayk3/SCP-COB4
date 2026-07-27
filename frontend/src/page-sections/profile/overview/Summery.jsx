import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { MoreButton } from '@/components/more-button';
import { FlexBetween } from '@/components/flexbox';
export default function Summery() {
  return <Card className="p-3">
      <FlexBetween>
        <Typography variant="body1" fontWeight={500}>
          Summary
        </Typography>

        <MoreButton size="small" />
      </FlexBetween>

      <Typography variant="body2" color="text.secondary" mt={2}>
        The new iPad combines the power and capability of a computer with the ease of use and
        versatility you’d never expect from one. <br /> <br /> And now it’s even more versatile,
        with a larger 10.2‑inch Retina display, support he new iPad combines the power and
        capability of a computer with the ease of use and versatility you’d never expect
      </Typography>
    </Card>;
}