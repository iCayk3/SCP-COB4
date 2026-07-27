import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { alpha, styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBetween } from '@/components/flexbox';
import { TableDataNotFound, TableToolbar } from '@/components/table';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '@/hooks/useMuiTable';
// CUSTOM ICON COMPONENTS
import Add from '@/icons/Add';
import Invoice from '@/icons/sidebar/Invoice';
// CUSTOM PAGE SECTION COMPONENTS
import InvoiceTableRow from '../InvoiceTableRow';
import InvoiceTableHead from '../InvoiceTableHead';
import InvoiceTableActions from '../InvoiceTableActions';
// CUSTOM DUMMY DATA
import { INVOICE_LIST } from '@/__fakeData__/invoices';

// STYLED COMPONENT
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .icon': {
    fontSize: 22
  }
}));
export default function InvoiceListPageView() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([...INVOICE_LIST]);
  const [invoiceFilter, setInvoiceFilter] = useState({
    search: '',
    status: ''
  });
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    setPage,
    isSelected,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    // defaultOrderBy: 'name'
  });
  useEffect(() => {
    setPage(0);
  }, [invoiceFilter, setPage]);
  const handleChangeFilter = useCallback((key, value) => {
    setInvoiceFilter(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  const filteredInvoices = useMemo(() => {
    const sortedInvoices = stableSort(invoices, getComparator(order, orderBy));
    return sortedInvoices.filter(item => {
      const {
        status,
        search
      } = invoiceFilter;
      if (status === 'pending') return item.status === 'Pending';
      if (status === 'complete') return item.status === 'Complete';
      if (search) {
        const searchTerm = search.toLowerCase();
        return item.name.toLowerCase().includes(searchTerm) || item.email.toLowerCase().includes(searchTerm);
      }
      return true;
    });
  }, [invoices, order, orderBy, invoiceFilter]);
  const paginatedInvoices = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);
  const handleDeleteInvoice = useCallback(id => {
    setInvoices(prev => prev.filter(item => item.id !== id));
  }, []);
  const handleAllDeleteInvoice = useCallback(() => {
    setInvoices(prev => prev.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  }, [selected, handleSelectAllRows]);
  return <Card>
      <FlexBetween flexWrap="wrap" gap={2} px={2} py={3}>
        <Stack direction="row" alignItems="center" gap={1}>
          <StyledAvatar variant="rounded">
            <Invoice color="primary" className="icon" />
          </StyledAvatar>

          <Typography variant="body1" fontWeight={500}>
            Invoice List
          </Typography>
        </Stack>

        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/dashboard/create-invoice')}>
          Add New Invoice
        </Button>
      </FlexBetween>

      {/* INVOICE FILTER ACTION BAR */}
      <InvoiceTableActions filter={invoiceFilter} handleChangeFilter={handleChangeFilter} />

      {/* TABLE ROW SELECTION HEADER  */}
      {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllDeleteInvoice} />}

      {/* TABLE HEAD & BODY ROWS */}
      <TableContainer>
        <Scrollbar autoHide={false}>
          <Table sx={{
          minWidth: 900
        }}>
            {/* TABLE HEAD SECTION */}
            <InvoiceTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredInvoices.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredInvoices.map(row => row.id))} />

            {/* TABLE BODY & DATA SECTION */}
            <TableBody>
              {filteredInvoices.length === 0 ? <TableDataNotFound /> : paginatedInvoices.map(invoice => <InvoiceTableRow key={invoice.id} invoice={invoice} handleSelectRow={handleSelectRow} isSelected={isSelected(invoice.id)} handleDeleteInvoice={handleDeleteInvoice} />)}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* TABLE PAGINATION SECTION */}
      <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredInvoices.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
    </Card>;
}