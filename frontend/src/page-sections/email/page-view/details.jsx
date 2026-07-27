import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// MUI ICON COMPONENTS
import AddToDrive from '@mui/icons-material/AddToDrive';
import FileDownload from '@mui/icons-material/FileDownload';
// CUSTOM COMPONENTS
import { MoreButton } from '@/components/more-button';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM LAYOUT COMPONENT
import Layout from '../Layout';
// CUSTOM ICON COMPONENTS
import Reply from '@/icons/duotone/Reply';
import Forward from '@/icons/duotone/Forward';
// STYLED COMPONENTS
import { IconWrapper, ImageBox } from '../styles';
export default function MailDetailsPageView() {
  const {
    direction
  } = useTheme();
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const ICON_STYLE = {
    mr: 1,
    fontSize: 14,
    color: 'grey.500',
    rotate: direction === 'rtl' ? '180deg' : 0
  };
  return <Layout>
      <div className="p-3">
        <FlexBetween gap={2}>
          <FlexBox alignItems="center" gap={2}>
            <Avatar src="/static/user/user-11.png" alt="penni nojel" />

            <div>
              <Typography variant="body1" fontWeight={500}>
                Penni Nojel
              </Typography>

              <Typography variant="body2" color="text.secondary" lineHeight={1}>
                penninojel@gmail.com
              </Typography>
            </div>
          </FlexBox>

          <FlexBox alignItems="center" gap={2}>
            {upSm && <Typography variant="body2" color="text.secondary">
                Dec 15, 2022, 1:45 PM
              </Typography>}

            <MoreButton size="small" />
          </FlexBox>
        </FlexBetween>

        <Typography variant="body1" sx={{
        mt: 5,
        fontWeight: 500
      }}>
          How to Choose the Perfect Shopify Theme and Build Your Online Store Fast!
        </Typography>

        <Typography variant="body2" sx={{
        my: 3,
        lineHeight: 1.9,
        textAlign: 'justify',
        color: 'text.secondary'
      }}>
          Learn how to build a branded design system as a solo designer—and everything else you need
          to know about the design systems landscape. Plus, discover how AI-generated art can help
          you deliver better designs in a fraction of the time. Wondering how to build a branded
          design system without a dedicated team? Using MUI components of course! Here's a
          step-by-step breakdown from a senior product designer who did just that—as a solo designer
          at a startup.
        </Typography>

        <Typography variant="body2" sx={{
        lineHeight: 1.9,
        textAlign: 'justify',
        color: 'text.secondary'
      }}>
          Learn how to build a branded design system as a solo designer—and everything else you need
          to know about the design systems landscape. Plus, discover how AI-generated art can help
          you deliver better designs in a fraction of the time. Wondering how to build a branded
          design system without a dedicated team? Using MUI components of course! Here's a
          step-by-step breakdown from a senior product designer who did just that—as a solo designer
          at a startup.
        </Typography>

        <Divider sx={{
        my: 4
      }} />

        <Typography variant="body2" fontSize={16}>
          2 Attachments available
        </Typography>

        <FlexBox gap={2} flexWrap="wrap" mt={2}>
          <ImageBox>
            <img src="/static/thumbnail/thumbnail-8.png" alt="thumbnail" />

            <IconWrapper className="actions">
              <IconButton>
                <FileDownload />
              </IconButton>

              <IconButton>
                <AddToDrive />
              </IconButton>
            </IconWrapper>
          </ImageBox>

          <ImageBox>
            <img src="/static/thumbnail/thumbnail-8.png" alt="thumbnail" />

            <IconWrapper className="actions">
              <IconButton>
                <FileDownload />
              </IconButton>

              <IconButton>
                <AddToDrive />
              </IconButton>
            </IconWrapper>
          </ImageBox>
        </FlexBox>

        <FlexBox mt={4} gap={2}>
          <Button color="secondary" variant="outlined">
            <Reply sx={ICON_STYLE} /> Reply
          </Button>

          <Button color="secondary" variant="outlined">
            <Forward sx={ICON_STYLE} /> Forward
          </Button>
        </FlexBox>
      </div>
    </Layout>;
}