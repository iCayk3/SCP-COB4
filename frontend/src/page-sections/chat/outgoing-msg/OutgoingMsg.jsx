import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// STYLED COMPONENT
import { Text } from './styles';
export default function OutgoingMsg() {
  return <Box alignSelf="end" maxWidth={{
    md: '60%',
    sm: '70%',
    xs: '80%'
  }}>
      <FlexBox justifyContent="end" alignItems="center" mb={1} gap={1.5}>
        <Typography variant="body2" sx={{
        lineHeight: 1,
        fontWeight: 500,
        span: {
          ml: 0.5,
          fontSize: 12,
          fontWeight: 400,
          color: 'text.secondary'
        }
      }}>
          <span>11:29 AM</span> You
        </Typography>

        <Avatar src="/static/user/user-11.png" sx={{
        width: 27,
        height: 27
      }} />
      </FlexBox>

      <Text>Sure! Ready to help.</Text>
    </Box>;
}