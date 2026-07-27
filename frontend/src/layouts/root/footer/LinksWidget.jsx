import { Fragment } from 'react';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
// STYLED COMPONENTS
import { LinkList } from './styles';

// ==============================================================

// ==============================================================

export default function LinksWidget({
  title,
  links
}) {
  return <Fragment>
      <Typography variant="body1" sx={{
      mb: 2.5,
      fontSize: 18,
      fontWeight: 500
    }}>
        {title}
      </Typography>

      <LinkList>
        {links.map(({
        id,
        title,
        url
      }) => <Link key={id} href={url}>
            {title}
          </Link>)}
      </LinkList>
    </Fragment>;
}