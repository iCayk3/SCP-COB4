import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
const StyledUl = styled('ul')(() => ({
  fontSize: 14,
  marginTop: 8,
  paddingLeft: '1rem',
  li: {
    lineHeight: 1.7
  }
}));
export default function ProductDescription() {
  return <Stack spacing={3} className="p-3">
      <div>
        <Typography variant="body1" fontWeight={500}>
          Description:
        </Typography>

        <Typography variant="body2" sx={{
        mt: 1,
        lineHeight: 1.5
      }}>
          Step into comfort and style with the AirFlex 9218 Sneakers. Designed for casual wear,
          these sneakers combine functionality with a modern aesthetic.
        </Typography>
      </div>

      <div>
        <Typography variant="body1" fontWeight={500}>
          Key Features:
        </Typography>

        <StyledUl>
          <li>Cozy Sockliner: Made of soft foam, providing all-day comfort and a snug fit.</li>
          <li>Convenient Pull Tab: Easy to slip on and off, perfect for on-the-go lifestyles.</li>
          <li>Durable Outsole: Engineered for reliable traction and long-lasting wear.</li>
          <li>
            Stylish Color Palette: A blend of White, Black, Oxygen Purple, and Action Grape for a
            bold, fashionable look.
          </li>
        </StyledUl>
      </div>

      <div>
        <Typography variant="body1" fontWeight={500}>
          Additional Information:
        </Typography>

        <StyledUl>
          <li>This product is not classified as personal protective equipment (PPE).</li>
          <li>Style Code: 921826-109</li>
          <li>Made in China</li>
        </StyledUl>
      </div>
    </Stack>;
}