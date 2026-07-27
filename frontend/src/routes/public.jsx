import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import RootLayout from '@/layouts/root/RootLayout';
import { LoadingProgress } from '@/components/loader';

// ROLE BASED PERMISSION TEST PAGE
const Permission = lazy(() => import('@/pages/permission'));

// FEATURES RELATED PAGES
const Faqs = lazy(() => import('@/pages/faq'));
const Cart = lazy(() => import('@/pages/cart'));
const Pricing = lazy(() => import('@/pages/pricing'));
const Checkout = lazy(() => import('@/pages/checkout'));
const ContactUs = lazy(() => import('@/pages/contact-us'));
const ComingSoon = lazy(() => import('@/pages/coming-soon'));
const Maintenance = lazy(() => import('@/pages/maintenance'));
const CareerApply = lazy(() => import('@/pages/career/apply'));
const CareerTwo = lazy(() => import('@/pages/career/career-2'));
const CareerDetails = lazy(() => import('@/pages/career/details'));
const AboutUsOne = lazy(() => import('@/pages/about-us/about-us-1'));
const Products = lazy(() => import('@/pages/shops/products'));
const ProductDetails = lazy(() => import('@/pages/shops/product-details'));
const LAYOUT_CONTENT = <RootLayout>
    <Suspense fallback={<LoadingProgress />}>
      <Outlet />
    </Suspense>
  </RootLayout>;
export const PublicRoutes = [{
  path: 'permission',
  element: <Permission />
}, {
  path: 'maintenance',
  element: <Maintenance />
}, {
  path: 'coming-soon',
  element: <ComingSoon />
}, {
  element: LAYOUT_CONTENT,
  children: [{
    path: 'about-us',
    element: <AboutUsOne />
  }, {
    path: 'contact-us',
    element: <ContactUs />
  }, {
    path: 'faqs',
    element: <Faqs />
  }, {
    path: 'pricing',
    element: <Pricing />
  }, {
    path: 'cart',
    element: <Cart />
  }, {
    path: 'checkout',
    element: <Checkout />
  }, {
    path: 'career',
    children: [{
      index: true,
      element: <CareerTwo />
    }, {
      path: ':slug',
      element: <CareerDetails />
    }, {
      path: 'apply',
      element: <CareerApply />
    }]
  }, {
    path: 'products',
    children: [{
      index: true,
      element: <Products />
    }, {
      path: ':id',
      element: <ProductDetails />
    }]
  }]
}];