import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
// CUSTOM ICON COMPONENT
import Add from '@/icons/Add';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { TableDataNotFound, TableToolbar } from '@/components/table';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '@/hooks/useMuiTable';
// CUSTOM PAGE SECTION COMPONENTS
import ProductTableRow from '../ProductTableRow';
import ProductTableHead from '../ProductTableHead';
import ProductTableActions from '../ProductTableActions';
// CUSTOM DUMMY DATA
import { PRODUCTS } from '@/__fakeData__/products';

//  STYLED COMPONENTS
const ListWrapper = styled('div')(({
  theme
}) => ({
  gap: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down(440)]: {
    flexDirection: 'column',
    '.MuiButton-root': {
      width: '100%'
    }
  }
}));
export default function ProductListPageView() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([...PRODUCTS]);
  const [productFilters, setProductFilters] = useState({
    stock: '',
    search: '',
    publish: ''
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
    defaultOrderBy: 'name'
  });
  useEffect(() => {
    setPage(0);
  }, [productFilters, setPage]);
  const handleChangeFilter = useCallback((key, value) => {
    setProductFilters(state => ({
      ...state,
      [key]: value
    }));
  }, []);
  const filteredProducts = useMemo(() => {
    const sortedProducts = stableSort(products, getComparator(order, orderBy));
    return sortedProducts.filter(item => {
      const {
        stock,
        publish,
        search
      } = productFilters;
      if (stock === 'stock') return item.stock > 0;
      if (stock === 'out-of-stock') return item.stock === 0;
      if (publish === 'published') return item.published;
      if (publish === 'draft') return !item.published;
      if (search) return item.name.toLowerCase().includes(search.toLowerCase());
      return true;
    });
  }, [products, order, orderBy, productFilters]);
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);
  const handleDeleteProduct = useCallback(id => {
    setProducts(prev => prev.filter(item => item.id !== id));
  }, []);
  const handleAllProductDelete = useCallback(() => {
    setProducts(prev => prev.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  }, [selected, handleSelectAllRows]);
  return <div className="pt-2 pb-4">
      <ListWrapper>
        <Tabs value={productFilters.stock} onChange={(_, value) => handleChangeFilter('stock', value)}>
          <Tab disableRipple label="All" value="" />
          <Tab disableRipple label="In Stock" value="stock" />
          <Tab disableRipple label="Out of Stock" value="out-of-stock" />
        </Tabs>

        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/dashboard/create-product')}>
          Add Product
        </Button>
      </ListWrapper>

      <Card sx={{
      mt: 4
    }}>
        {/* SEARCH AND PUBLISH FILTER SECTION */}
        <ProductTableActions filter={productFilters} handleChangeFilter={handleChangeFilter} />

        {/* TABLE ROW SELECTION HEADER  */}
        {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllProductDelete} />}

        {/* TABLE HEAD AND ROW SECTION */}
        <TableContainer>
          <Scrollbar>
            <Table sx={{
            minWidth: 820
          }}>
              <ProductTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredProducts.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredProducts.map(row => row.id))} />

              <TableBody>
                {filteredProducts.length === 0 ? <TableDataNotFound /> : paginatedProducts.map(product => <ProductTableRow key={product.id} product={product} handleSelectRow={handleSelectRow} isSelected={isSelected(product.id)} handleDeleteProduct={handleDeleteProduct} />)}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredProducts.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
      </Card>
    </div>;
}