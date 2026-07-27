import { useCallback, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { StyledInputBase } from './styles';
export function Counter({
  onChange,
  count = 1,
  min = 1,
  max = Infinity,
  disabled = false,
  colors = 'light',
  button = 'plain',
  variant = 'rounded'
}) {
  const [value, setValue] = useState(count);
  const validateValue = useCallback(newValue => Math.min(Math.max(newValue, min), max), [min, max]);
  const handleIncrement = useCallback(() => {
    if (disabled) return;
    setValue(prevValue => {
      const newValue = validateValue(prevValue + 1);
      if (newValue !== prevValue && onChange) {
        onChange(newValue);
      }
      return newValue;
    });
  }, [validateValue, onChange, disabled]);
  const handleDecrement = useCallback(() => {
    if (disabled) return;
    setValue(prevValue => {
      const newValue = validateValue(prevValue - 1);
      if (newValue !== prevValue && onChange) {
        onChange(newValue);
      }
      return newValue;
    });
  }, [validateValue, onChange, disabled]);

  // QUANTITY INCREMENT BUTTON
  const StartAdornment = <IconButton onClick={handleIncrement} disabled={disabled || value >= max}>
      <Add fontSize="small" />
    </IconButton>;

  // QUANTITY DECREMENT BUTTON
  const EndAdornment = <IconButton onClick={handleDecrement} disabled={disabled || value <= min}>
      <Remove fontSize="small" />
    </IconButton>;
  return <StyledInputBase type="number" min={min} max={max} value={value} colors={colors} button={button} variant={variant} disabled={disabled} endAdornment={EndAdornment} startAdornment={StartAdornment} />;
}