import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM DUMMY DATA SET
import { ACCOUNT_LIST } from './data';
export default function SocialAccounts() {
  return <Card sx={{
    pb: 2
  }}>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Social Account
      </Typography>

      <Divider />

      {ACCOUNT_LIST.map(({
      id,
      body,
      connect,
      image,
      title
    }) => <FlexBetween key={id} sx={{
      borderBottom: 1,
      padding: '1rem 1.5rem',
      borderColor: 'divider',
      '&:last-of-type': {
        borderBottom: 0
      }
    }}>
          <FlexBox alignItems="center" gap={2}>
            <Avatar src={image} alt={title} />

            <div>
              <Typography variant="body2" fontWeight={500} lineHeight={1}>
                {title}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {body}
              </Typography>
            </div>
          </FlexBox>

          <Button color={connect ? 'primary' : 'secondary'} variant={connect ? 'contained' : 'outlined'}>
            {connect ? 'Connect' : 'Disconnect'}
          </Button>
        </FlexBetween>)}
    </Card>;
}