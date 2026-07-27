import { useNavigate } from 'react-router';
// MUI
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

// ==============================================================

// ==============================================================

export default function ComponentPreviewCard({
  title,
  image,
  link
}) {
  const navigate = useNavigate();
  return <Card onClick={() => navigate(link)} sx={{
    border: 1,
    boxShadow: 0,
    borderRadius: 3,
    borderColor: 'divider',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      scale: 1.01,
      '.text': {
        textDecoration: 'underline'
      }
    }
  }}>
      <CardMedia alt={title} height="150" image={image} component="img" sx={theme => ({
      padding: 2,
      backgroundColor: theme.palette.grey[50],
      ...theme.applyStyles('dark', {
        opacity: 0.5,
        backgroundColor: 'transparent'
      })
    })} />

      <CardContent className="text" sx={{
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 13
    }}>
        {title}
      </CardContent>
    </Card>;
}