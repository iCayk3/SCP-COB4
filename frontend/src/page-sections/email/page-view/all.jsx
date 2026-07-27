import { useNavigate } from 'react-router';
// MUI
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import StarBorder from '@mui/icons-material/StarBorder';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM LAYOUT COMPONENT
import Layout from '../Layout';
// CUSTOM ICON COMPONENTS
import Trash from '@/icons/duotone/Trash';
import Archive from '@/icons/duotone/Archive';
import UnreadMail from '@/icons/duotone/UnreadMail';
// STYLED COMPONENTS
import { MailActionWrapper, MailItem } from '../styles';

// CONSTANTS

const PADDING_ZERO = {
  p: 0
};
const FONT_SIZE_16 = {
  fontSize: 16
};
const FONT_SIZE_18 = {
  fontSize: 18
};
const AVATAR_STYLES = {
  width: 25,
  height: 25
};
const MESSAGE_STYLES = {
  flex: 1,
  maxWidth: {
    sm: 500,
    xs: 275
  }
};
export default function AllMailPageView() {
  const navigate = useNavigate();
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  return <Layout>
      {Array.from({
      length: 10
    }).map((_, i) => <MailItem key={i} onClick={() => navigate('/dashboard/mail/details')}>
          <FlexBox alignItems="center" gap={2}>
            {upSm && <Checkbox size="small" sx={PADDING_ZERO} onClick={e => {
          e.stopPropagation();
        }} />}

            {upSm && <Tooltip title="Starred">
                <IconButton size="small" sx={PADDING_ZERO} onClick={e => {
            e.stopPropagation();
          }}>
                  <StarBorder fontSize="small" />
                </IconButton>
              </Tooltip>}

            <Avatar src="/static/user/user-11.png" sx={AVATAR_STYLES} alt="Penni Nojel" />

            {upSm && <Typography variant="body2" fontWeight={600}>
                Penni Nojel
              </Typography>}
          </FlexBox>

          <Typography noWrap variant="body2" color="text.secondary" sx={MESSAGE_STYLES}>
            How to Choose the Perfect Shopify Theme and Build Your Online Store Fast!
          </Typography>

          <Typography variant="body2" fontSize={12} className="time" color="text.secondary">
            1:45 PM
          </Typography>

          <MailActionWrapper className="actions">
            <Tooltip title="Archive">
              <IconButton color="secondary" size="small" onClick={e => {
            e.stopPropagation();
          }}>
                <Archive sx={FONT_SIZE_16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Trash">
              <IconButton color="secondary" size="small" onClick={e => {
            e.stopPropagation();
          }}>
                <Trash sx={FONT_SIZE_16} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Unread">
              <IconButton color="secondary" size="small" onClick={e => {
            e.stopPropagation();
          }}>
                <UnreadMail sx={FONT_SIZE_18} />
              </IconButton>
            </Tooltip>
          </MailActionWrapper>
        </MailItem>)}
    </Layout>;
}