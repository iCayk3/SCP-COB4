import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
// CUSTOM ICON COMPONENTS
import InvertColors from '@/icons/InvertColors';
import PaletteOutlined from '@/icons/PaletteOutlined';
import KeyframeBezierIn from '@/icons/KeyframeBezierIn';
// STYLED COMPONENTS
import { IconWrapper, StyledAvatarGroup } from './styles';
export default function Teams() {
  const theme = useTheme();

  // CUSTOM DUMMY DATA
  const TEAM_LIST = [{
    id: 1,
    Icon: KeyframeBezierIn,
    company: 'Ui Lib',
    position: 'Software Engineers',
    date: 'Jan 12, 2021',
    color: theme.palette.primary.main
  }, {
    id: 2,
    Icon: PaletteOutlined,
    company: 'Team Uko',
    position: 'Visual Designers',
    date: 'Jan 22, 2021',
    color: theme.palette.info.main
  }, {
    id: 3,
    Icon: InvertColors,
    company: 'Team Olly',
    position: 'Web Developers',
    date: 'Jan 12, 2021',
    color: theme.palette.warning.main
  }];
  return <Card className="p-3">
      <Typography variant="body1" fontWeight={500} sx={{
      mb: 2
    }}>
        Teams
      </Typography>

      <Scrollbar autoHide={false}>
        <Table sx={{
        minWidth: 600,
        '& .MuiTableCell-root': {
          py: 0.5
        }
      }}>
          <TableBody>
            {TEAM_LIST.map(({
            Icon,
            color,
            company,
            date,
            id,
            position
          }) => <TableRow key={id}>
                <TableCell>
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <IconWrapper color={color}>
                      <Icon sx={{
                    color: color
                  }} />
                    </IconWrapper>

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {company}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {position}
                      </Typography>
                    </div>
                  </Stack>
                </TableCell>

                <TableCell>Formed {date}</TableCell>

                <TableCell>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <StyledAvatarGroup max={3}>
                      <Avatar src="/static/user/user-11.png" />
                      <Avatar src="/static/user/user-13.png" />
                      <Avatar src="/static/user/user-14.png" />
                      <Avatar src="/static/user/user-15.png" />
                      <Avatar src="/static/user/user-17.png" />
                    </StyledAvatarGroup>

                    <Chip size="small" color="secondary" label="30 members" />
                  </Stack>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}