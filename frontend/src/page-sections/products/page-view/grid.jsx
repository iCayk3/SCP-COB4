import { useCallback, useMemo, useState } from 'react';
// MUI
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { ProductCard } from '@/components/product-cards/product-card-1';
import { FlexBox, FlexRowAlign } from '@/components/flexbox';
import SearchArea from '@/page-sections/users/SearchArea';
// CUSTOM ICON COMPONENTS
import Add from '@/icons/Add';
import ShoppingBasket from '@/icons/ShoppingBasket';
// CUSTOM DUMMY DATA
import { PRODUCTS } from '@/__fakeData__/products';

// STYLED COMPONENTS
const HeadingWrapper = styled('div')(({
  theme
}) => ({
  gap: 8,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down(453)]: {
    '& .MuiButton-root': {
      order: 2
    },
    '& .MuiTabs-root': {
      order: 3,
      width: '100%',
      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-between'
      }
    }
  }
}));
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .icon': {
    fontSize: 22,
    color: theme.palette.primary.main
  }
}));
const PAGE_SIZE = 8;
export default function ProductGridPageView() {
  const [pageIndex, setPageIndex] = useState(1);
  const [selectTab, setSelectTab] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [products, setProducts] = useState([...PRODUCTS]);
  const handleChangeTab = useCallback((_, newTab) => {
    setSelectTab(newTab);
    setPageIndex(1);
  }, []);
  const handleSearch = useCallback(e => {
    setSearchValue(e.target.value);
    setPageIndex(1);
  }, []);
  const handleLoadMore = useCallback(() => {
    setPageIndex(prev => prev + 1);
  }, []);
  const filteredProducts = useMemo(() => {
    const searchTerm = searchValue.toLowerCase();
    return products.filter(item => {
      if (selectTab === 'stock') return item.stock > 0;
      if (selectTab === 'out-of-stock') return item.stock === 0;
      return true;
    }).filter(item => item.name.toLowerCase().includes(searchTerm)).slice(0, pageIndex * PAGE_SIZE);
  }, [products, selectTab, searchValue, pageIndex]);
  const handleDeleteProduct = useCallback(id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setProducts(prev => prev.filter(item => item.id !== id));
  }, []);
  const hasMoreProducts = products.length > filteredProducts.length;
  return <div className="pt-2 pb-4">
      <TabContext value={selectTab}>
        <HeadingWrapper>
          <FlexBox gap={1} alignItems="center">
            <StyledAvatar variant="rounded">
              <ShoppingBasket className="icon" />
            </StyledAvatar>

            <Typography variant="body1" fontWeight={500}>
              Products
            </Typography>
          </FlexBox>

          <TabList onChange={handleChangeTab}>
            <Tab disableRipple label="All" value="" />
            <Tab disableRipple label="In Stock" value="stock" />
            <Tab disableRipple label="Out of Stock" value="out-of-stock" />
          </TabList>

          <Button variant="contained" startIcon={<Add />} LinkComponent={Link} href="/dashboard/create-product">
            Add Product
          </Button>
        </HeadingWrapper>

        <SearchArea value={searchValue} onChange={handleSearch} gridRoute="/dashboard/product-grid" listRoute="/dashboard/product-list" />

        <Grid container spacing={3}>
          {/* PRODUCT CARD LIST */}
          {filteredProducts.map(product => <Grid size={{
          md: 3,
          sm: 6,
          xs: 12
        }} key={product.id}>
              <ProductCard product={product} handleDelete={() => handleDeleteProduct(product.id)} />
            </Grid>)}

          {/* NOT FOUND PRODUCT VIEW */}
          {filteredProducts.length === 0 && <Grid size={12}>
              <FlexRowAlign fontSize={18} minHeight={300} fontWeight={700} borderRadius={2} bgcolor="action.selected">
                Data Not Found!
              </FlexRowAlign>
            </Grid>}

          {/* LOAD MORE BUTTON */}
          {filteredProducts.length > 0 && hasMoreProducts && <Grid size={12}>
              <FlexRowAlign mt={2}>
                <Button onClick={handleLoadMore}>Load More Products</Button>
              </FlexRowAlign>
            </Grid>}
        </Grid>
      </TabContext>
    </div>;
}