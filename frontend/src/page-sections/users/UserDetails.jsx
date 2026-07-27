import { Fragment, useCallback, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
// CUSTOM COMPONENTS
import { Modal } from '@/components/modal';
import AddContactForm from './AddContactForm';
import { TableMoreMenuItem } from '@/components/table';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Add from '@/icons/Add';
import Call from '@/icons/Call';
import City from '@/icons/City';
import Edit from '@/icons/Edit';
import Flag from '@/icons/Flag';
import UserIcon from '@/icons/User';
import Email from '@/icons/Email';
import Skype from '@/icons/social/Skype';
import ShareVs from '@/icons/ShareVs';
import Birthday from '@/icons/Birthday';
import Facebook from '@/icons/social/Facebook';
import Whatsapp from '@/icons/social/Whatsapp';
import Messenger from '@/icons/Messenger';
import MoreHorizontal from '@/icons/MoreHorizontal';
// CUSTOM DATA TYPES

// STYLED COMPONENTS
const StyledRoot = styled('div')(({
  theme
}) => ({
  height: '100%',
  padding: '1.5rem',
  borderTopRightRadius: '1rem',
  borderBottomRightRadius: '1rem',
  backgroundColor: theme.palette.grey[50],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900]
  })
}));
const UserAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  backgroundColor: 'white'
});
const NoDataBox = styled('div')(({
  theme
}) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary
}));

// ==============================================================

// ==============================================================

export default function UserDetails({
  user
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleCloseModal = useCallback(() => setOpenModal(false), []);
  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);
  const handleAddNewContact = useCallback(() => {
    setIsEdit(false);
    setOpenModal(true);
  }, []);
  const handleEdit = useCallback(() => {
    setIsEdit(true);
    setOpenModal(true);
  }, []);
  return <StyledRoot>
      <Button fullWidth variant="contained" startIcon={<Add />} onClick={handleAddNewContact}>
        Add Contact
      </Button>

      <Modal open={openModal} handleClose={handleCloseModal}>
        <AddContactForm handleCancel={handleCloseModal} user={isEdit ? user : undefined} />
      </Modal>

      {user ? <Fragment>
          <FlexBetween mt={4}>
            <IconButton size="small" onClick={handleEdit}>
              <Edit sx={{
            color: 'text.secondary',
            fontSize: 18
          }} />
            </IconButton>

            <IconButton size="small" onClick={e => setAnchorEl(e.currentTarget)}>
              <MoreHorizontal sx={{
            color: 'text.secondary',
            fontSize: 18
          }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}>
              <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => handleCloseMenu()} />
            </Menu>
          </FlexBetween>

          <Stack alignItems="center">
            <UserAvatar src={user.avatar} />

            <Typography variant="body2" sx={{
          fontWeight: 500,
          mt: 2
        }}>
              {user.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.position}
            </Typography>
          </Stack>

          <Box mt={4}>
            <ListItem Icon={Birthday} title="June 3, 1996" />
            <ListItem Icon={UserIcon} title="Female" />
            <ListItem Icon={City} title={user.company} />
            <ListItem Icon={Email} title={user.email} />
            <ListItem Icon={Call} title={user.phone} />
            <ListItem Icon={ShareVs} title="http://carriepage.com" />
            <ListItem Icon={Flag} title="6956 Henderson Park" />
            <ListItem Icon={Messenger} title={user.phone} />
            <ListItem Icon={Facebook} title="facebook-carrie-page" />
            <ListItem Icon={Skype} title="carrie-page" />
            <ListItem Icon={Whatsapp} title="+1 (345) 556-2248" />
          </Box>
        </Fragment> : <NoDataBox>No Data</NoDataBox>}
    </StyledRoot>;
}

// ===================================================================

// ===================================================================

function ListItem({
  Icon,
  title
}) {
  return <Stack direction="row" spacing={1} alignItems="center" pb={3}>
      <Icon sx={{
      color: 'text.secondary',
      fontSize: 18
    }} />
      <Typography variant="body2" color="grey.500" lineHeight={1}>
        {title}
      </Typography>
    </Stack>;
}