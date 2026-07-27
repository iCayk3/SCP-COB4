import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
export default function UpgradeCard() {
  return <Card className="p-3">
      <FlexBetween flexDirection="column">
        <Typography variant="h6" lineHeight={1.4} sx={{
        pb: 3,
        maxWidth: 200,
        textAlign: 'center',
        '& span': {
          color: 'primary.main'
        }
      }}>
          Upgrade to <span color="primary.main">PRO</span> for more resources
        </Typography>

        <img src="/static/illustration/job-management.svg" width="100%" alt="Upgrade" />
      </FlexBetween>
    </Card>;
}