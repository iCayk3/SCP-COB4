import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useProgress } from '@bprogress/react';
export function LoadingProgress() {
  const {
    start,
    stop
  } = useProgress();
  useEffect(() => {
    start();
    return () => stop();
  }, []);
  return <Box minHeight="100vh" />;
}