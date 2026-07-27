import { useCallback, useMemo, useState } from 'react';
// MUI
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// MUI ICON COMPONENT
import Tune from '@mui/icons-material/Tune';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
const SORTBY_VALUES = [{
  value: 'featured',
  label: 'Featured'
}, {
  value: 'best-selling',
  label: 'Best Selling'
}, {
  value: 'low-to-high',
  label: 'Price: Low to High'
}, {
  value: 'high-to-low',
  label: 'Price: High to Low'
}];

// ==============================================================

// ==============================================================

export default function FilterActions({
  handleSidebar,
  onSortByChange,
  sortBy
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const activeOption = useMemo(() => SORTBY_VALUES.find(item => item.value === sortBy) || SORTBY_VALUES[0], [sortBy]);
  const isMenuOpen = Boolean(anchorEl);
  const handleOpenMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleSelectOption = useCallback(value => {
    onSortByChange(value);
    handleCloseMenu();
  }, [onSortByChange, handleCloseMenu]);
  return <FlexBetween gap={2} mb={4}>
      <Button size="large" color="secondary" variant="outlined" startIcon={<Tune />} onClick={handleSidebar} aria-label="Open filter sidebar">
        Filter
      </Button>

      <Button size="large" color="secondary" variant="outlined" onClick={handleOpenMenu} endIcon={<KeyboardArrowDown />} aria-haspopup="true" aria-expanded={isMenuOpen} aria-controls={isMenuOpen ? 'sort-menu' : undefined}>
        Sort By: {activeOption ? activeOption.label : 'Featured'}
      </Button>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleCloseMenu}>
        {SORTBY_VALUES.map(option => <MenuItem key={option.value} onClick={() => handleSelectOption(option.value)}>
            {option.label}
          </MenuItem>)}
      </Menu>
    </FlexBetween>;
}