import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Income',
  data: [48000, 40000, 22000, 30000, 28000, 20000, 48000, 25000, 20000, 44000, 25000, 15000]
}, {
  name: 'Expense',
  data: [42000, 35000, 28000, 15000, 20000, 30000, 45000, 20000, 30000, 41000, 35000, 15000]
}];

// ==============================================================

// ==============================================================

export default function Transactions({
  type = 'bar'
}) {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    chart: {
      stacked: false
    },
    colors: [theme.palette.primary.main, theme.palette.grey[200]],
    grid: {
      show: true
    },
    xaxis: {
      categories,
      crosshairs: {
        show: false
      },
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      show: true,
      max: 50000,
      tickAmount: 5,
      labels: {
        formatter: value => value / 1000 + 'K',
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: val => `$${val}`
      }
    },
    stroke: {
      show: true,
      ...(type === 'bar' && {
        width: 3,
        colors: ['transparent']
      })
    },
    legend: {
      show: true,
      position: 'top',
      fontSize: '14px',
      itemMargin: {
        horizontal: 12
      },
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      }
    },
    ...(type === 'bar' && {
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '43%',
          borderRadiusApplication: 'end'
        }
      },
      responsive: [{
        breakpoint: 550,
        options: {
          chart: {
            height: 450
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          xaxis: {
            min: 0,
            show: true,
            max: 50000,
            tickAmount: 5,
            labels: {
              formatter: value => value / 1000 + 'K',
              style: {
                colors: theme.palette.text.secondary
              }
            }
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                fontWeight: 500,
                colors: theme.palette.text.secondary,
                fontFamily: theme.typography.fontFamily
              }
            }
          }
        }
      }]
    })
  });
  return <Card>
      <Typography variant="h6" sx={{
      mb: 2,
      px: 3,
      pt: 3
    }}>
        Transactions
      </Typography>

      <Box px={1}>
        <Chart type={type} height={275} options={options} series={series} />
      </Box>
    </Card>;
}