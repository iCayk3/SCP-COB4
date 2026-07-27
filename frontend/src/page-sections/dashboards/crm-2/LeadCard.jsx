import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM ICON COMPONENTS
import ChartPieIcon from '@/icons/ChartPieIcon';

// STYLED COMPONENT
const StyledRoot = styled(Card)(({
  theme
}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .content': {
    flexGrow: 1,
    flexShrink: 0,
    '.icon-wrapper': {
      width: 24,
      height: 24,
      borderRadius: '50%',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.divider,
      gap: '.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '.result': {
      gap: '.5rem',
      display: 'flex',
      alignItems: 'center',
      marginTop: '.5rem'
    }
  },
  '& .avatar': {
    width: 'auto',
    height: 'auto',
    borderRadius: '0%'
  }
}));
export default function LeadCard() {
  return <StyledRoot className="p-3 h-full">
      <div className="content">
        <Typography variant="body1" fontWeight={500}>
          Leads Converted
        </Typography>

        <Typography variant="h6" fontSize={20} fontWeight={600} color="primary.main">
          80%
        </Typography>

        <div className="result">
          <div className="icon-wrapper">
            <ChartPieIcon color="inherit" fontSize="small" />
          </div>

          <Typography variant="body2" fontWeight={500}>
            56 out of 70
          </Typography>
        </div>
      </div>

      <Avatar alt="Lead Converted" src="/static/illustration/crm-lead.svg" className="avatar" />
    </StyledRoot>;
}