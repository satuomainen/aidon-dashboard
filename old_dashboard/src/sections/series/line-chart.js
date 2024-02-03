import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import localizeTopic from '../../utils/topic-localizations';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeStyle: 'short',
  timeZone: 'Europe/Helsinki'
});

function useChartOptions(chartSeries) {
  const theme = useTheme();

  const categories = chartSeries.data.map(v => {
    return timeFormat.format(new Date(v.received));
  });

  return {
    noData: {
      text: 'No data'
    },
    markers: {
      size: 5
    },
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    stroke: {
      colors: [theme.palette.primary.main],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };
}

export const LineChart = (props) => {
  const { chartSeries, sx } = props;
  const chartOptions = useChartOptions(chartSeries);
  const series = [
    {
      name: chartSeries.name,
      data: chartSeries.data.map(d => d.value)
    }
  ];

  return (
    <Card sx={sx}>
      <CardHeader title={localizeTopic(chartSeries.name)}/>
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={series}
          type="line"
          width="100%"
        />
      </CardContent>
    </Card>
  );
};

LineChart.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object
};
