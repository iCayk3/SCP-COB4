import { useCallback } from 'react';
import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHODS
import { currency } from '@/utils/currency';
export default function WalletSummery() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useCallback((base, track) => {
    return useChartOptions({
      colors: [base],
      labels: ['Audits'],
      stroke: {
        lineCap: 'round'
      },
      plotOptions: {
        radialBar: {
          track: {
            background: track
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              color: base,
              offsetY: 6,
              fontWeight: 500
            }
          },
          hollow: {
            size: '50%',
            dropShadow: {
              enabled: true,
              opacity: 0.2
            }
          }
        }
      }
    });
  }, []);
  return <Card className="p-3 h-full">
      <div>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Wallet Summery
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Last 7 days reports
        </Typography>
      </div>

      <Stack mt={4} spacing={3}>
        <FlexBetween sx={{
        borderRadius: 3,
        backgroundColor: 'primary.25',
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.primary[500], 0.03)
        })
      }}>
          <Box pl={3}>
            <Typography variant="body2" fontSize={16} fontWeight={600}>
              {currency(2160.36)}
            </Typography>

            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Income
            </Typography>
          </Box>

          <Chart width={140} height={120} series={[70]} type="radialBar" options={options(theme.palette.primary.main, theme.palette.primary[100])} />
        </FlexBetween>

        <FlexBetween sx={{
        borderRadius: 3,
        backgroundColor: 'primary.25',
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.grey[200], 0.01)
        })
      }}>
          <Box pl={3}>
            <Typography variant="body2" fontSize={16} fontWeight={600}>
              {currency(850.65)}
            </Typography>

            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Outcome
            </Typography>
          </Box>

          <Chart width={140} height={120} series={[30]} type="radialBar" options={options(theme.palette.grey[500], theme.palette.grey[200])} />
        </FlexBetween>
      </Stack>
    </Card>;
}