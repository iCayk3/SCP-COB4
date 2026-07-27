import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENT
import DateRange from '@/icons/DateRange';

// =======================================================================================

// =======================================================================================

export default function PostItem({
  date,
  title,
  imgLink,
  category
}) {
  return <FlexBetween>
      <Stack spacing={1}>
        <div>
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>

          <Typography variant="body2" color="grey.500">
            {category}
          </Typography>
        </div>

        <FlexBox gap={0.5} alignItems="center" color="text.secondary">
          <DateRange sx={{
          fontSize: 18
        }} />
          <Typography variant="caption" fontWeight={500} lineHeight={1}>
            Publish on {date}
          </Typography>
        </FlexBox>
      </Stack>

      <FlexBox width={125} height={75} overflow="hidden" borderRadius="8px">
        <img src={imgLink} width="100%" alt="Post" />
      </FlexBox>
    </FlexBetween>;
}