import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

// =====================================================================

// =====================================================================

export default function DocumentCard({
  file,
  img,
  title,
  Icon
}) {
  return <Card sx={{
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
      {Icon && <Icon sx={{
      fontSize: 66,
      color: 'text.secondary'
    }} />}

      {img && <img src={img} alt={title} width={66} style={{
      marginBottom: 8
    }} />}

      <Typography variant="body2" fontWeight={500}>
        {title}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{
      mt: 0.5,
      lineHeight: 1,
      display: 'inline-block'
    }}>
        {file} files
      </Typography>
    </Card>;
}