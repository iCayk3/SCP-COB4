import { useEffect, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
// CUSTOM COMPONENTS
import { FlexRowAlign } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function ProgressItem({
  title,
  value
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500);
    return () => clearTimeout(timer);
  }, []);
  return <FlexRowAlign flexDirection="column" gap={1} maxWidth={80}>
      <Box position="relative" display="inline-flex">
        <CircularProgress size={80} value={100} thickness={3} color="secondary" variant="determinate" />

        <CircularProgress size={80} thickness={3} value={progress} disableShrink color="primary" variant="determinate" sx={{
        left: 0,
        position: 'absolute',
        animationDuration: '550ms',
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: 'round'
        }
      }} />
        <FlexRowAlign sx={{
        inset: 0,
        position: 'absolute'
      }}>
          <Typography variant="body1" fontWeight={600}>
            {`${Math.round(value)}%`}
          </Typography>
        </FlexRowAlign>
      </Box>

      <Typography variant="body2" fontWeight={500}>
        {title}
      </Typography>
    </FlexRowAlign>;
}