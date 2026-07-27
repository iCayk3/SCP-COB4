import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
// MUI
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// REACT TRANSLATION
import { useTranslation } from 'react-i18next';

// STYLED COMPONENTS
const IconWrapper = styled('div')({
  width: 24,
  height: 24,
  padding: '2px',
  display: 'flex',
  '& img': {
    width: '100%',
    objectFit: 'cover',
    borderRadius: '50%'
  }
});

// ==============================================================

// ==============================================================

const LANGUAGE_OPTIONS = {
  en: {
    label: 'English',
    icon: '/static/flags/usa-round.png'
  },
  es: {
    label: 'Spanish',
    icon: '/static/flags/spain-round.png'
  }
};
export default function LanguagePopover() {
  const {
    i18n
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChangeLanguage = useCallback(language => {
    i18n.changeLanguage(language);
    setOpen(false);
  }, [i18n]);
  const selectedLanguage = useMemo(() => LANGUAGE_OPTIONS[i18n.language], [i18n.language]);
  return <Fragment>
      <IconButton onClick={handleOpen} ref={anchorRef}>
        <IconWrapper>
          <img alt={selectedLanguage.label} src={selectedLanguage.icon} />
        </IconWrapper>
      </IconButton>

      <Popover keepMounted open={open} onClose={handleClose} anchorEl={anchorRef.current} anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }} slotProps={{
      paper: {
        sx: {
          width: 110,
          paddingBlock: 1
        }
      }
    }}>
        {Object.entries(LANGUAGE_OPTIONS).map(([lang, {
        label
      }]) => <MenuItem key={label} onClick={() => handleChangeLanguage(lang)}>
            {label}
          </MenuItem>)}
      </Popover>
    </Fragment>;
}