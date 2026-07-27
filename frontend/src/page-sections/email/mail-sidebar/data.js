import SendTwoTone from '@mui/icons-material/SendTwoTone';
// CUSTOM ICON COMPONENTS
import Mail from '@/icons/duotone/Mail';
import Edit from '@/icons/duotone/Edit';
import Trash from '@/icons/duotone/Trash';
import Inbox from '@/icons/duotone/Inbox';
import Report from '@/icons/duotone/Report';
import StartHalf from '@/icons/duotone/StarHalf';

// CUSTOM DUMMY DATA SET
export const LIST_ITEMS = [{
  value: 0,
  Icon: Mail,
  id: 'W-L9VCsprOG-SJ6EK4PCo',
  title: 'All Mail',
  url: '/dashboard/mail/all'
}, {
  value: 16,
  Icon: Inbox,
  id: 'nlIrqb1l8X-DSyDrkEASc',
  title: 'Inbox',
  url: '/dashboard/mail/inbox'
}, {
  value: 0,
  Icon: SendTwoTone,
  id: 'meMxH3De-VQm5-k-Ku9Zw',
  title: 'Sent',
  url: '/dashboard/mail/sent'
}, {
  value: 0,
  Icon: Edit,
  id: 'WSCkfCPExUfwRX-ByyJKu',
  title: 'Draft',
  url: '#'
}, {
  value: 0,
  Icon: StartHalf,
  id: 'p3TAjby3T4tn3CSsP8Ze3',
  title: 'Starred',
  url: '#'
}, {
  value: 0,
  Icon: Report,
  id: 'oVquywDVT_hPx79rmJYyU',
  title: 'Spam',
  url: '#'
}, {
  value: 0,
  Icon: Trash,
  id: '0T_MBXhHLeRnO6LkVCLea',
  title: 'Trash',
  url: '#'
}];
export const LABELS = [{
  value: 0,
  id: 'w0j8nBNnGWl0NZs5Iwolq',
  title: 'Personal',
  color: 'primary.main'
}, {
  value: 0,
  id: 'XDov9vIbBphncVMRJJPPd',
  title: 'Company',
  color: 'success.main'
}, {
  value: 0,
  id: 'rPmBIpkGNCB2ES_OG1h0H',
  title: 'Important',
  color: 'warning.main'
}, {
  value: 0,
  id: '_PRGF_2BnyTugmmD88WBS',
  title: 'Private',
  color: 'error.main'
}];