import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
// CUSTOM COMPONENTS
import MegaMenuList from './MegaMenuList';
import { FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENT
import ChevronDown from '@/icons/ChevronDown';
// PAGES NAVIGATION
import { PAGES_MENUS } from './navigation';
// STYLED COMPONENTS
import { MainListItem, MenusContainer } from './styles';

// ==============================================================

// ==============================================================

export default function MegaMenu({
  isDark
}) {
  return <MainListItem>
      <FlexBox className="menu-item" sx={{
      cursor: 'pointer',
      alignItems: 'center',
      color: isDark ? 'text.primary' : 'white'
    }}>
        <span>Pages</span> <ChevronDown sx={{
        fontSize: 19
      }} />
      </FlexBox>

      <MenusContainer className="inner-menu">
        <Card sx={{
        px: 3,
        py: 4,
        mt: 1.5,
        width: '100%'
      }}>
          <Grid container spacing={3}>
            {PAGES_MENUS.map(({
            id,
            title,
            child
          }) => <Grid size={4} key={id}>
                <MegaMenuList title={title} child={child} />
              </Grid>)}
          </Grid>
        </Card>
      </MenusContainer>
    </MainListItem>;
}