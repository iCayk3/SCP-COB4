import Box from '@mui/material/Box';
export function FlexBox({
  ref,
  children,
  ...props
}) {
  return <Box display="flex" ref={ref} {...props}>
      {children}
    </Box>;
}