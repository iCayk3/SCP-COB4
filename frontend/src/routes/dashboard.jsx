import { lazy, Suspense } from 'react';
import LayoutV1 from '@/layouts/layout-1';
import LayoutV2 from '@/layouts/layout-2';
import { AuthGuard } from '@/components/auth';
import { LoadingProgress } from '@/components/loader';
import { useSettings } from '@/hooks/useSettings';

// ALL DASHBOARD PAGES
const CRM = lazy(() => import('@/pages/dashboard/crm'));
const CRMV2 = lazy(() => import('@/pages/dashboard/crm-2'));
const Sales = lazy(() => import('@/pages/dashboard/sales'));
const SalesV2 = lazy(() => import('@/pages/dashboard/sales-2'));
const Finance = lazy(() => import('@/pages/dashboard/finance'));
const FinanceV2 = lazy(() => import('@/pages/dashboard/finance-2'));
const Analytics = lazy(() => import('@/pages/dashboard/analytics'));
const AnalyticsV2 = lazy(() => import('@/pages/dashboard/analytics-2'));
const Ecommerce = lazy(() => import('@/pages/dashboard/ecommerce'));
const Logistics = lazy(() => import('@/pages/dashboard/logistics'));
const Marketing = lazy(() => import('@/pages/dashboard/marketing'));
const LMS = lazy(() => import('@/pages/dashboard/learning-management'));
const JobManagement = lazy(() => import('@/pages/dashboard/job-management'));
const Cobrancas = lazy(() => import('@/pages/cobrancas'));
const Verificacao = lazy(() => import('@/pages/verificacao'));
const Regras = lazy(() => import('@/pages/verificacao/regras'));
const Timeline = lazy(() => import('@/pages/verificacao/timeline'));
const Fluxos = lazy(() => import('@/pages/fluxos'));
const FaixasAtraso = lazy(() => import('@/pages/faixas-atraso'));
const CatalogosMotivos = lazy(() => import('@/pages/catalogos-motivos'));
const Configuracoes = lazy(() => import('@/pages/configuracoes'));
const Metricas = lazy(() => import('@/pages/metricas'));
const Backlog = lazy(() => import('@/pages/backlog'));
const Lgpd = lazy(() => import('@/pages/lgpd'));
const ConfiguracaoSincronizacao = lazy(() => import('@/pages/configuracao-sincronizacao'));

// USER LIST PAGES
const AddNewUser = lazy(() => import('@/pages/users/add-new-user'));
const UserListView = lazy(() => import('@/pages/users/user-list-1'));
const UserGridView = lazy(() => import('@/pages/users/user-grid-1'));
const UserListView2 = lazy(() => import('@/pages/users/user-list-2'));
const UserGridView2 = lazy(() => import('@/pages/users/user-grid-2'));

// USER ACCOUNT PAGE
const Account = lazy(() => import('@/pages/account'));

// ALL INVOICE RELATED PAGES
const InvoiceList = lazy(() => import('@/pages/invoice/list'));
const InvoiceCreate = lazy(() => import('@/pages/invoice/create'));
const InvoiceDetails = lazy(() => import('@/pages/invoice/details'));

// PRODUCT RELATED PAGES
const ProductList = lazy(() => import('@/pages/products/list'));
const ProductGrid = lazy(() => import('@/pages/products/grid'));
const ProductCreate = lazy(() => import('@/pages/products/create'));
const ProductDetails = lazy(() => import('@/pages/products/details'));

// E-COMMERCE RELATED PAGES
const Cart = lazy(() => import('@/pages/ecommerce/cart'));
const Payment = lazy(() => import('@/pages/ecommerce/payment'));
const BillingAddress = lazy(() => import('@/pages/ecommerce/billing-address'));
const PaymentComplete = lazy(() => import('@/pages/ecommerce/payment-complete'));

// USER PROFILE PAGE
const Profile = lazy(() => import('@/pages/profile'));

// REACT DATA TABLE PAGE
const DataTable1 = lazy(() => import('@/pages/data-tables/table-1'));

// OTHER BUSINESS RELATED PAGES
const Career = lazy(() => import('@/pages/career/career-1'));
const About = lazy(() => import('@/pages/about-us/about-us-2'));
const FileManager = lazy(() => import('@/pages/file-manager'));

// SUPPORT RELATED PAGES
const Support = lazy(() => import('@/pages/support/support'));
const CreateTicket = lazy(() => import('@/pages/support/create-ticket'));

// CHAT PAGE
const Chat = lazy(() => import('@/pages/chat'));

// USER TODO LIST PAGE
const TodoList = lazy(() => import('@/pages/todo-list'));

// MAIL RELATED PAGES
const Sent = lazy(() => import('@/pages/email/sent'));
const AllMail = lazy(() => import('@/pages/email/all'));
const Inbox = lazy(() => import('@/pages/email/inbox'));
const Compose = lazy(() => import('@/pages/email/compose'));
const MailDetails = lazy(() => import('@/pages/email/details'));

//  PROJECT PAGES
const ProjectV1 = lazy(() => import('@/pages/projects/version-1'));
const ProjectV2 = lazy(() => import('@/pages/projects/version-2'));
const ProjectV3 = lazy(() => import('@/pages/projects/version-3'));
const ProjectDetails = lazy(() => import('@/pages/projects/details'));
const TeamMember = lazy(() => import('@/pages/projects/team-member'));
const ActiveLayout = () => {
  const {
    settings
  } = useSettings();
  return <AuthGuard>
      <Suspense fallback={<LoadingProgress />}>
        {settings.activeLayout === 'layout2' ? <LayoutV2 /> : <LayoutV1 />}
      </Suspense>
    </AuthGuard>;
};
export const DashboardRoutes = [{
  path: 'dashboard',
  element: <ActiveLayout />,
  children: [{
    index: true,
    element: <Analytics />
  }, {
    path: 'cobrancas',
    element: <Cobrancas />
  }, {
    path: 'verificacao',
    children: [{
      index: true,
      element: <Verificacao />
    }, {
      path: 'regras',
      element: <Regras />
    }, {
      path: 'timeline',
      element: <Timeline />
    }, {
      path: 'fluxos',
      element: <Fluxos />
    }, {
      path: 'faixas-atraso',
      element: <FaixasAtraso />
    }, {
      path: 'catalogos-motivos',
      element: <CatalogosMotivos />
    }]
  }, {
    path: 'configuracoes',
    children: [{
      index: true,
      element: <Configuracoes />
    }, {
      path: 'fluxos',
      element: <Fluxos />
    }, {
      path: 'faixas-atraso',
      element: <FaixasAtraso />
    }, {
      path: 'catalogos-motivos',
      element: <CatalogosMotivos />
    }, {
      path: 'lgpd',
      element: <Lgpd />
    }, {
      path: 'sincronizacao-rbx',
      element: <ConfiguracaoSincronizacao />
    }]
  }, {
    path: 'planejamento',
    children: [{
      path: 'metricas',
      element: <Metricas />
    }, {
      path: 'backlog',
      element: <Backlog />
    }]
  }, {
    path: 'crm',
    element: <CRM />
  }, {
    path: 'crm-2',
    element: <CRMV2 />
  }, {
    path: 'sales',
    element: <Sales />
  }, {
    path: 'sales-2',
    element: <SalesV2 />
  }, {
    path: 'finance',
    element: <Finance />
  }, {
    path: 'finance-2',
    element: <FinanceV2 />
  }, {
    path: 'ecommerce',
    element: <Ecommerce />
  }, {
    path: 'logistics',
    element: <Logistics />
  }, {
    path: 'marketing',
    element: <Marketing />
  }, {
    path: 'analytics-2',
    element: <AnalyticsV2 />
  }, {
    path: 'learning-management',
    element: <LMS />
  }, {
    path: 'job-management',
    element: <JobManagement />
  }, {
    path: 'add-user',
    element: <AddNewUser />
  }, {
    path: 'user-list',
    element: <UserListView />
  }, {
    path: 'user-grid',
    element: <UserGridView />
  }, {
    path: 'user-list-2',
    element: <UserListView2 />
  }, {
    path: 'user-grid-2',
    element: <UserGridView2 />
  }, {
    path: 'account',
    element: <Account />
  }, {
    path: 'invoice-list',
    element: <InvoiceList />
  }, {
    path: 'create-invoice',
    element: <InvoiceCreate />
  }, {
    path: 'invoice-details',
    element: <InvoiceDetails />
  }, {
    path: 'product-list',
    element: <ProductList />
  }, {
    path: 'product-grid',
    element: <ProductGrid />
  }, {
    path: 'create-product',
    element: <ProductCreate />
  }, {
    path: 'product-details',
    element: <ProductDetails />
  }, {
    path: 'cart',
    element: <Cart />
  }, {
    path: 'payment',
    element: <Payment />
  }, {
    path: 'billing-address',
    element: <BillingAddress />
  }, {
    path: 'payment-complete',
    element: <PaymentComplete />
  }, {
    path: 'profile',
    element: <Profile />
  }, {
    path: 'data-table-1',
    element: <DataTable1 />
  }, {
    path: 'about',
    element: <About />
  }, {
    path: 'career',
    element: <Career />
  }, {
    path: 'file-manager',
    element: <FileManager />
  }, {
    path: 'support',
    element: <Support />
  }, {
    path: 'create-ticket',
    element: <CreateTicket />
  }, {
    path: 'chat',
    element: <Chat />
  }, {
    path: 'todo-list',
    element: <TodoList />
  }, {
    path: 'mail',
    children: [{
      path: 'all',
      element: <AllMail />
    }, {
      path: 'inbox',
      element: <Inbox />
    }, {
      path: 'sent',
      element: <Sent />
    }, {
      path: 'compose',
      element: <Compose />
    }, {
      path: 'details',
      element: <MailDetails />
    }]
  }, {
    path: 'projects',
    children: [{
      path: 'version-1',
      element: <ProjectV1 />
    }, {
      path: 'version-2',
      element: <ProjectV2 />
    }, {
      path: 'version-3',
      element: <ProjectV3 />
    }, {
      path: 'details',
      element: <ProjectDetails />
    }, {
      path: 'team-member',
      element: <TeamMember />
    }]
  }]
}];
