import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM DATA
import { PROJECT_STATUS } from '@/__fakeData__/projects';

// STYLED COMPONENTS
const StyledRoot = styled(Card)({
  paddingTop: '1.5rem',
  paddingInline: '2rem',
  '& .MuiTabs-root': {
    borderBottom: 'none'
  }
});
const Title = styled(Typography)({
  marginBottom: '1rem',
  lineHeight: 1
});

// ==============================================================

// ==============================================================

export default function StatusFilter({
  value,
  handleChange
}) {
  return <StyledRoot>
      <Title variant="h6" fontSize={20}>
        Projects
      </Title>

      <TabContext value={value}>
        <TabList variant="scrollable" onChange={(_, value) => handleChange(value)}>
          {PROJECT_STATUS.map(({
          amount,
          title,
          value
        }) => <Tab disableRipple key={title} value={value} label={<Typography variant="body2">
                  {title} ({amount})
                </Typography>} />)}
        </TabList>
      </TabContext>
    </StyledRoot>;
}