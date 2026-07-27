import { Fragment, useState } from 'react';
// MUI
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENT
import Clear from '@mui/icons-material/Clear';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM DEFINED HOOK
import { useSettings } from '@/hooks/useSettings';
// THEME SETTINGS INTERFACE

// STYLED COMPONENTS
const CustomDrawer = styled(Drawer)(({
  theme
}) => ({
  width: 250,
  flexShrink: 0,
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    width: 250,
    overflow: 'initial',
    boxShadow: theme.shadows[2],
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));
const LayoutBox = styled('div')(({
  theme
}) => ({
  height: 200,
  width: '100%',
  cursor: 'pointer',
  borderRadius: 8,
  marginBottom: 20,
  position: 'relative',
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  '.layout-name': {
    display: 'none',
    zIndex: 12,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: 8
  },
  '&:hover .layout-name, &.selected .layout-name': {
    display: 'flex'
  },
  '.layout-img': {
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  }
}));
const StyledButton = styled(Button)(() => ({
  position: 'fixed',
  top: '40%',
  right: -30,
  height: 30,
  fontWeight: 400,
  transform: 'rotate(90deg)',
  borderRadius: '0 0 5px 5px'
}));
export default function LayoutSetting() {
  const [open, setOpen] = useState(false);
  const {
    settings,
    saveSettings
  } = useSettings();
  const toggleDrawer = () => setOpen(prev => !prev);
  const handleLayoutChange = layoutName => {
    saveSettings({
      ...settings,
      activeLayout: layoutName
    });
    toggleDrawer();
  };
  return <Fragment>
      <StyledButton color="primary" onClick={toggleDrawer}>
        Layouts
      </StyledButton>

      <CustomDrawer open={open} anchor="right" variant="persistent">
        <FlexBox alignItems="center" justifyContent="space-between" px={2} py={1}>
          <Typography variant="body2" fontWeight={500}>
            Available Layouts
          </Typography>

          <IconButton size="small" onClick={toggleDrawer}>
            <Clear fontSize="inherit" />
          </IconButton>
        </FlexBox>

        <Divider />

        <FlexBox p={2} flexDirection="column">
          {demoLayouts.map(({
          name,
          title,
          imgUrl
        }) => <LayoutBox key={name} onClick={() => handleLayoutChange(name)} className={settings.activeLayout === name ? 'selected' : ''}>
              <div className="layout-name">
                <Button variant="contained">{title}</Button>
              </div>

              <img className="layout-img" src={imgUrl} alt={name} />
            </LayoutBox>)}
        </FlexBox>
      </CustomDrawer>
    </Fragment>;
}
const demoLayouts = [{
  name: 'layout1',
  title: 'Layout V1',
  imgUrl: '/static/layouts/layout-1.jpg'
}, {
  name: 'layout2',
  title: 'Layout V2',
  imgUrl: '/static/layouts/layout-2.jpg'
}];