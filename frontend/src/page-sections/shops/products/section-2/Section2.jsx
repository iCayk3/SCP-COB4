import { useCallback, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
// CUSTOM COMPONENTS
import FilterActions from './FilterActions';
import ProductFilterSidebar from './product-filter-sidebar';
import { ProductCard } from '@/components/product-cards/product-card-2';
// DATA
import { PRODUCTS } from '@/__fakeData__/products';
// TYPE

// CUSTOM UTILS METHODS
import { isEqual, shuffle } from '@/utils/helpers';
const DEFAULT_FILTERS = {
  gender: [],
  category: [],
  color: [],
  price: [0, 200],
  rating: 0
};
export default function Section2() {
  const [sortBy, setSortBy] = useState('featured');
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const handleOpenFilter = useCallback(() => {
    setIsOpenFilter(true);
  }, []);
  const handleCloseFilter = useCallback(() => {
    setIsOpenFilter(false);
  }, []);
  const handleChangeFilters = useCallback((key, values) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
    }));
  }, []);
  const handleClearFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS
    });
  }, []);
  const hasFilterApplied = isEqual(DEFAULT_FILTERS, filters);
  const filteredProducts = useMemo(() => {
    let products = [...PRODUCTS];
    if (filters.gender.length > 0) {
      products = shuffle(PRODUCTS);
    }
    const [minPrice, maxPrice] = filters.price;
    if (minPrice !== 0 || maxPrice !== 200) {
      products = products.filter(pro => pro.price >= minPrice && pro.price <= maxPrice);
    }
    if (filters.rating > 0) {
      products = shuffle(PRODUCTS);
    }
    if (filters.category.length > 0) {
      products = shuffle(PRODUCTS);
    }
    if (filters.color.length > 0) {
      products = shuffle(PRODUCTS);
    }
    if (sortBy !== 'featured') {
      products = shuffle(PRODUCTS);
    }
    return products;
  }, [filters, sortBy]);
  return <div className="py-10">
      <FilterActions sortBy={sortBy} handleSidebar={handleOpenFilter} onSortByChange={value => setSortBy(value)} />

      <ProductFilterSidebar filters={filters} open={isOpenFilter} filterApplied={hasFilterApplied} handleClear={handleClearFilters} onChangeFilters={handleChangeFilters} handleClose={handleCloseFilter} />

      <Grid container spacing={3}>
        {filteredProducts.map(product => <Grid size={{
        md: 4,
        sm: 6,
        xs: 12
      }} key={product.id}>
            <ProductCard id={product.id} name={product.name} price={product.price} image={product.image} />
          </Grid>)}
      </Grid>
    </div>;
}