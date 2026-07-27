import { Fragment, lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import Container from '@mui/material/Container';
// CUSTOM COMPONENTS
import Footer from '@/layouts/root/footer/Footer';
import Header from '@/layouts/root/Navigation';
import { LoadingProgress } from '@/components/loader';

// ALL MUI COMPONENT SHOWCASE PAGES
const Components = lazy(() => import('@/pages/examples/components'));
const MuiChip = lazy(() => import('@/pages/examples/mui/chip'));
const MuiList = lazy(() => import('@/pages/examples/mui/list'));
const MuiMenu = lazy(() => import('@/pages/examples/mui/menu'));
const MuiTabs = lazy(() => import('@/pages/examples/mui/tabs'));
const MuiAlert = lazy(() => import('@/pages/examples/mui/alert'));
const MuiBadge = lazy(() => import('@/pages/examples/mui/badge'));
const MuiTable = lazy(() => import('@/pages/examples/mui/table'));
const MuiRating = lazy(() => import('@/pages/examples/mui/rating'));
const MuiSlider = lazy(() => import('@/pages/examples/mui/slider'));
const MuiAvatar = lazy(() => import('@/pages/examples/mui/avatar'));
const MuiDialog = lazy(() => import('@/pages/examples/mui/dialog'));
const MuiSwitch = lazy(() => import('@/pages/examples/mui/switch'));
const MuiTooltip = lazy(() => import('@/pages/examples/mui/tooltip'));
const MuiButtons = lazy(() => import('@/pages/examples/mui/buttons'));
const MuiPickers = lazy(() => import('@/pages/examples/mui/pickers'));
const MuiPopover = lazy(() => import('@/pages/examples/mui/popover'));
const MuiStepper = lazy(() => import('@/pages/examples/mui/stepper'));
const MuiTimeline = lazy(() => import('@/pages/examples/mui/timeline'));
const MuiSnackbar = lazy(() => import('@/pages/examples/mui/snackbar'));
const MuiCheckbox = lazy(() => import('@/pages/examples/mui/checkbox'));
const MuiProgress = lazy(() => import('@/pages/examples/mui/progress'));
const MuiDataGrid = lazy(() => import('@/pages/examples/mui/data-grid'));
const MuiTreeview = lazy(() => import('@/pages/examples/mui/tree-view'));
const MuiAccordion = lazy(() => import('@/pages/examples/mui/accordion'));
const MuiTextField = lazy(() => import('@/pages/examples/mui/textfield'));
const MuiPagination = lazy(() => import('@/pages/examples/mui/pagination'));
const MuiBreadcrumbs = lazy(() => import('@/pages/examples/mui/breadcrumbs'));
const MuiRadioButton = lazy(() => import('@/pages/examples/mui/radio-button'));
const MuiAutocomplete = lazy(() => import('@/pages/examples/mui/autocomplete'));
const MuiTransferList = lazy(() => import('@/pages/examples/mui/transfer-list'));
const LAYOUT_CONTENT = <Fragment>
    <Container maxWidth="lg">
      <Header />
    </Container>

    <Suspense fallback={<LoadingProgress />}>
      <Outlet />
    </Suspense>

    <Footer />
  </Fragment>;
export const ComponentRoutes = [{
  path: 'components',
  element: LAYOUT_CONTENT,
  children: [{
    element: <Components />,
    index: true
  }, {
    path: 'accordion',
    element: <MuiAccordion />
  }, {
    path: 'alert',
    element: <MuiAlert />
  }, {
    path: 'autocomplete',
    element: <MuiAutocomplete />
  }, {
    path: 'avatar',
    element: <MuiAvatar />
  }, {
    path: 'badge',
    element: <MuiBadge />
  }, {
    path: 'breadcrumbs',
    element: <MuiBreadcrumbs />
  }, {
    path: 'buttons',
    element: <MuiButtons />
  }, {
    path: 'checkbox',
    element: <MuiCheckbox />
  }, {
    path: 'chip',
    element: <MuiChip />
  }, {
    path: 'data-grid',
    element: <MuiDataGrid />
  }, {
    path: 'dialog',
    element: <MuiDialog />
  }, {
    path: 'list',
    element: <MuiList />
  }, {
    path: 'menu',
    element: <MuiMenu />
  }, {
    path: 'pagination',
    element: <MuiPagination />
  }, {
    path: 'pickers',
    element: <MuiPickers />
  }, {
    path: 'popover',
    element: <MuiPopover />
  }, {
    path: 'progress',
    element: <MuiProgress />
  }, {
    path: 'radio-button',
    element: <MuiRadioButton />
  }, {
    path: 'rating',
    element: <MuiRating />
  }, {
    path: 'slider',
    element: <MuiSlider />
  }, {
    path: 'stepper',
    element: <MuiStepper />
  }, {
    path: 'switch',
    element: <MuiSwitch />
  }, {
    path: 'table',
    element: <MuiTable />
  }, {
    path: 'tabs',
    element: <MuiTabs />
  }, {
    path: 'textfield',
    element: <MuiTextField />
  }, {
    path: 'timeline',
    element: <MuiTimeline />
  }, {
    path: 'tooltip',
    element: <MuiTooltip />
  }, {
    path: 'transfer-list',
    element: <MuiTransferList />
  }, {
    path: 'tree-view',
    element: <MuiTreeview />
  }, {
    path: 'snackbar',
    element: <MuiSnackbar />
  }]
}];