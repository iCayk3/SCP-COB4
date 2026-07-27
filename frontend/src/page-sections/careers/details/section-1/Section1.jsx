import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENT
import { Link } from '@/components/link';
// STYLED COMPONENT
import { StyledRoot } from './styles';
export default function Section1() {
  return <StyledRoot elevation={3}>
      <div>
        <div className="title">
          <Typography fontSize={24} variant="h5">
            UI and UX Designer
          </Typography>
          <Chip label="Full Time" color="primary" />
          <Chip label="Remote" color="success" />
        </div>

        <Typography variant="body2" sx={{
        lineHeight: 1,
        paddingBlock: '1rem 1.5rem'
      }}>
          at <Link href="#">UI-Lib</Link>
        </Typography>

        <div className="tags">
          <Chip label="www.ui-lib.com" color="secondary" />
          <Chip label="Contact" color="secondary" />
          <Chip label="jobs@ui-lib.com" color="secondary" />
          <Chip label="+0123456789" color="secondary" />
          <Chip label="Facebook" color="secondary" />
          <Chip label="Whatsapp" color="secondary" />
          <Chip label="Twitter" color="secondary" />
          <Chip label="Instagram" color="secondary" />
        </div>
      </div>

      <div>
        <Button size="large" LinkComponent={Link} href="/career/apply">
          Apply this job
        </Button>
      </div>
    </StyledRoot>;
}