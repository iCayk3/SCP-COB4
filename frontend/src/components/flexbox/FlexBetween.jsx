import Box from '@mui/material/Box';
export function FlexBetween({
  ref,
  children,
  ...props
}) {
  return <Box display="flex" alignItems="center" justifyContent="space-between" ref={ref} {...props}>
      {children}
    </Box>;
}