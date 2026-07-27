import { useState } from 'react';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import CreateForm from '../create-form';
import { SearchInput } from '@/components/search-input';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM STYLED COMPONENTS
import { ButtonWrapper } from './styles';

// ==============================================================

// ==============================================================

export default function TableActions({
  rowSelected,
  hasColumnFilter,
  handleSearch,
  handleDeleteRow,
  handleResetColumnFilter
}) {
  const [openForm, setOpenForm] = useState(false);
  return <FlexBetween flexWrap="wrap" gap={2}>
      {/* SEARCH INPUT BOX */}
      <SearchInput placeholder="Find Friends" onChange={e => handleSearch(e.target.value.trim())} />

      <ButtonWrapper>
        {/* SELECTED ITEM AND DELETE BUTTON */}
        {rowSelected ? <div className="select-action">
            <Typography variant="body2" fontWeight={500}>
              {rowSelected} Selected
            </Typography>

            <Button size="small" color="error" variant="contained" onClick={handleDeleteRow}>
              Delete
            </Button>
          </div> : null}

        {/* CLEAR FILTER BUTTON */}
        {hasColumnFilter ? <Button size="small" color="error" variant="contained" onClick={handleResetColumnFilter}>
            Clear filter
          </Button> : null}

        {/* ADD EMPLOYEE BUTTON  */}
        <Button endIcon={<Add />} variant="contained" onClick={() => setOpenForm(true)}>
          Add Employee
        </Button>

        {/* ADD USER FORM MODAL */}
        <CreateForm open={openForm} onClose={() => setOpenForm(false)} />
      </ButtonWrapper>
    </FlexBetween>;
}