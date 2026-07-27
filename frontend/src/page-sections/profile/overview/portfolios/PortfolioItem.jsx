import Chip from '@mui/material/Chip';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Download from '@mui/icons-material/Download';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
// STYLED COMPONENT
import { StyledIconButton, DateWrapper, ItemRoot } from './styles';

// ==============================================================================================

// ==============================================================================================

export default function PortfolioItem({
  tag,
  date,
  title,
  imgLink
}) {
  return <ItemRoot>
      <CardMedia component="img" image={imgLink} height={152} />

      <DateWrapper>
        <Typography variant="caption" lineHeight={1.3} fontWeight={600}>
          {new Date(date).getDate()}
        </Typography>

        <Typography lineHeight={1} variant="caption" color="text.secondary">
          {new Date(date).toLocaleString('default', {
          month: 'short'
        })}
        </Typography>
      </DateWrapper>

      <CardContent sx={{
      p: 1,
      pt: 2,
      ':last-child': {
        pb: 0
      }
    }}>
        <div className="action-group">
          <Chip label={tag} size="small" />

          <div>
            <StyledIconButton size="small" disableRipple className="mr">
              <Download color="primary" fontSize="small" />
            </StyledIconButton>

            <StyledIconButton size="small" disableRipple>
              <FavoriteBorder color="action" fontSize="small" />
            </StyledIconButton>
          </div>
        </div>

        <div className="text-group">
          <Typography variant="body2" lineHeight={1} fontWeight={500}>
            {title}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {new Date(date).toLocaleString('default', {
            timeStyle: 'short',
            dateStyle: 'medium'
          })}
          </Typography>
        </div>
      </CardContent>
    </ItemRoot>;
}