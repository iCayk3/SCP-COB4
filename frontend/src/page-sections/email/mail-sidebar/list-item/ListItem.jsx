import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { FlexBox } from '@/components/flexbox';
import { StyledRoot } from './styles';
export default function ListItem({
  title,
  value,
  Icon,
  active,
  handleChange
}) {
  return <StyledRoot active={active} onClick={handleChange}>
      <FlexBox gap={1.5} alignItems="center">
        {Icon}

        <Typography variant="body2" className="title">
          {title}
        </Typography>
      </FlexBox>

      {value > 0 && <Chip className="badge" size="small" label={`(${value})`} color="secondary" />}
    </StyledRoot>;
}