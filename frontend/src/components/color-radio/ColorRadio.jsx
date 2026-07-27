import Radio from '@mui/material/Radio';
import { InnerBox, OuterBox } from './styles';
export function ColorRadio({
  ref,
  icon_color,
  ...props
}) {
  return <Radio ref={ref} icon={<OuterBox>
          <InnerBox color={icon_color} />
        </OuterBox>} checkedIcon={<OuterBox color={icon_color}>
          <InnerBox color={icon_color} />
        </OuterBox>} sx={{
    padding: 0,
    ...props.sx
  }} {...props} />;
}