import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM DUMMY DATA SET
import { ACCOUNT_LIST } from './data';
export default function ConnectedAccounts() {
  return <Card sx={{
    pb: 2
  }}>
      <div className="p-3">
        <Typography variant="body1" fontWeight={500}>
          Connected accounts
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Two-factor authentication adds to log in, in you'll need to provide a 4 digit amazing
          code. <Link href="#">Learn More</Link>
        </Typography>
      </div>

      <Divider />

      {ACCOUNT_LIST.map(({
      id,
      title,
      body,
      image
    }) => <FlexBetween key={id} sx={{
      borderBottom: 1,
      padding: '1rem 1.5rem',
      borderColor: 'divider',
      '&:last-of-type': {
        borderBottom: 0,
        pb: 0
      }
    }}>
          <FlexBox alignItems="center" gap={2}>
            <Avatar src={image} alt={title} />

            <div>
              <Typography variant="body2" fontWeight={500}>
                {title}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {body}
              </Typography>
            </div>
          </FlexBox>

          <Switch defaultChecked />
        </FlexBetween>)}
    </Card>;
}