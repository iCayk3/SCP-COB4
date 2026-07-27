import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import DownloadTo from '@/icons/DownloadTo';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// COMMON STYLED COMPONENTS
import { BodyTableRow } from '../styles';
// STYLED COMPONENTS
import { EarningBox, StyledStack, BodyTableCell, EarningBoxWrapper, StyledHeadTableCell } from './styles';
// CUSTOM DUMMY DATA SET
import { EARNING_LIST } from './data';
export default function Statements() {
  return <Card sx={{
    pb: 2
  }}>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Earnings
      </Typography>

      <Divider />

      <div className="p-3">
        <Typography variant="body2" sx={{
        color: 'grey.500',
        span: {
          color: 'primary.main'
        }
      }}>
          Last <span>15</span> day earnings calculated
        </Typography>

        <EarningBoxWrapper flexWrap="wrap" pt={2}>
          <StyledStack direction="row" flexWrap="wrap" spacing={2}>
            {EARNING_LIST.map(({
            id,
            Icon,
            amount,
            iconColor,
            name
          }) => <EarningBox key={id}>
                <Icon color={iconColor} />

                <Typography variant="body2" fontWeight={500} my={0.5}>
                  {currency(amount)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {name}
                </Typography>
              </EarningBox>)}
          </StyledStack>

          <Button variant="contained">Withdraw $4,550</Button>
        </EarningBoxWrapper>
      </div>

      <FlexBetween px={3} py={2}>
        <Typography variant="body2" fontWeight={500}>
          Statement
        </Typography>

        <Select defaultValue={2022} size="small">
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2021}>2021</MenuItem>
          <MenuItem value={2020}>2020</MenuItem>
        </Select>
      </FlexBetween>

      <Scrollbar autoHide={false}>
        <Table sx={{
        minWidth: 800
      }}>
          <TableHead>
            <TableRow>
              <StyledHeadTableCell>Date</StyledHeadTableCell>
              <StyledHeadTableCell>Order ID</StyledHeadTableCell>
              <StyledHeadTableCell>Order Details</StyledHeadTableCell>
              <StyledHeadTableCell>Amount</StyledHeadTableCell>
              <StyledHeadTableCell>Invoice</StyledHeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3, 4, 5, 6].map(item => <BodyTableRow key={item}>
                <BodyTableCell>Nov 12, 2021</BodyTableCell>
                <BodyTableCell>202745788</BodyTableCell>
                <BodyTableCell>The Icon of full icon set</BodyTableCell>
                <BodyTableCell>$650</BodyTableCell>
                <BodyTableCell>
                  <Button size="small" variant="contained" disabled={item === 1} startIcon={<DownloadTo />}>
                    Download
                  </Button>
                </BodyTableCell>
              </BodyTableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}