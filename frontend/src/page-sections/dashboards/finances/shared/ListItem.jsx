import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox, FlexRowAlign } from '@/components/flexbox';

// =========================================================================

// =========================================================================

export default function ListItem({
  Icon,
  title,
  subTitle,
  titleStyle = {}
}) {
  return <FlexBox alignItems="center" gap={1.5}>
      <FlexRowAlign sx={theme => ({
      width: 40,
      height: 40,
      borderRadius: 2,
      backgroundColor: theme.palette.grey[50],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700]
      })
    })}>
        {Icon}
      </FlexRowAlign>

      <div>
        <Typography variant="body1" lineHeight={1} fontWeight={600} sx={titleStyle}>
          {title}
        </Typography>

        {subTitle && <Typography variant="body2" color="text.secondary">
            {subTitle}
          </Typography>}
      </div>
    </FlexBox>;
}