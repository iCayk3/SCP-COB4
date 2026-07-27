import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import North from '@mui/icons-material/North';
import South from '@mui/icons-material/South';
// CUSTOM COMPONENTS
import ListItem from './shared/ListItem';
import { FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHODS
import { currency, format } from '@/utils/currency';

// STYLED COMPONENTS
const StyledCard = styled(Card)(({
  theme
}) => ({
  border: 0,
  padding: 3,
  position: 'relative',
  background: 'linear-gradient(103.35deg, #FFFFFF 63.76%, #EDEAFF 98.71%)',
  ...theme.applyStyles('dark', {
    background: 'auto'
  })
}));
const ImageContainer = styled('div')(({
  theme
}) => ({
  right: 0,
  bottom: 0,
  position: 'absolute',
  '& > img': {
    width: '100%'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

// CUSTOM DUMMY DATA
const DATA = [{
  id: 1,
  title: 'Income',
  amount: 14210.15,
  Icon: <South color="success" fontSize="small" />
}, {
  id: 2,
  title: 'Expance',
  amount: 7352.17,
  Icon: <North color="error" fontSize="small" />
}];
export default function Balance() {
  return <StyledCard>
      <div className="p-3">
        <Typography variant="body2" fontSize={27} fontWeight={600}>
          {currency(21350.25)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          My Balance
        </Typography>

        <FlexBox flexWrap="wrap" alignItems="center" gap={3} py={4}>
          {DATA.map(({
          Icon,
          amount,
          id,
          title
        }) => <ListItem Icon={Icon} title={format(amount)} subTitle={title} key={id} />)}
        </FlexBox>

        <FlexBox alignItems="center" gap={2}>
          <Button sx={{
          minWidth: 100
        }}>Send</Button>
          <Button variant="outlined" color="secondary" sx={{
          minWidth: 100
        }}>
            Receive
          </Button>
        </FlexBox>
      </div>

      <ImageContainer>
        <img src="/static/illustration/finance-balance.svg" alt="my-balance" />
      </ImageContainer>
    </StyledCard>;
}