import Head from 'next/head';
import {
  Box,
  Container, Typography,
  Unstable_Grid2 as Grid,
  Stack
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LineChart } from 'src/sections/series/line-chart';
import { useMqtt } from '../hooks/use-mqtt';
import localizeTopic from '../utils/topic-localizations';

function createLineChart(series) {
  return (
    <Grid
      key={series.name}
      s={12}
      sm={6}
      lg={4}
    >
      <LineChart
        chartSeries={series}
        sx={{ height: '100%', width: 450 }}
      />
    </Grid>
  );
}

function createLineCharts(topics) {
  if (!topics) {
    return null;
  }

  const series = Object
    .entries(topics)
    .map(([name, data]) => ({ name, data }));

  series.sort((left, right) => {
    const leftActual = localizeTopic(left.name);
    const rightActual = localizeTopic(right.name);
    if (leftActual < rightActual) {
      return -1;
    } else if (leftActual > rightActual) {
      return 1;
    } else {
      return 0;
    }
  });

  return series.map(createLineChart);
}

function Page() {
  const mqtt = useMqtt();
  const lineCharts = createLineCharts(mqtt?.topics);

  return (
    <>
      <Head>
        <title>
          Time Series
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h2">
              Latest received values
            </Typography>
            <Typography variant="caption">
              To clear received values, refresh the page
            </Typography>
            <Grid
              container
              spacing={3}
            >
              {lineCharts}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
