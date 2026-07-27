import { Fragment } from 'react';
import { useLocation } from 'react-router';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
// STYLED COMPONENT
import { MenuList } from './styles';

// ==============================================================

// ==============================================================

export default function MegaMenuList({
  title,
  child
}) {
  const {
    pathname
  } = useLocation();
  return <Fragment>
      <Typography variant="body2" fontWeight={500}>
        {title}
      </Typography>

      <MenuList>
        {child.map(item => <Link key={item.id} href={item.href} className={clsx({
        active: pathname === item.href
      })}>
            {item.title}
          </Link>)}
      </MenuList>
    </Fragment>;
}