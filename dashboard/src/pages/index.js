import Head from 'next/head';
import { Box, Container, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import Battery50Icon from '@heroicons/react/24/solid/Battery50Icon';
import BoltIcon from '@heroicons/react/24/solid/BoltIcon';
import FireIcon from '@heroicons/react/24/solid/FireIcon';
import NoSymbolIcon from '@heroicons/react/24/solid/NoSymbolIcon';
import QuestionMarkCircleIcon from '@heroicons/react/24/solid/QuestionMarkCircleIcon';
import SparklesIcon from '@heroicons/react/24/solid/SparklesIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useMqtt } from '../hooks/use-mqtt';
import { MomentaryValue } from '../sections/overview/momentary-value';
import localizeTopic from '../utils/topic-localizations';
import { last } from '../utils/util';

function getIcon(topicName) {
  if (topicName.endsWith('(V)')) {
    return (<BoltIcon/>);
  }

  if (topicName.endsWith('(kW)') || topicName.endsWith('(kVar)')) {
    return (<Battery50Icon/>);
  }

  if (topicName.endsWith('(A)')) {
    return (<SparklesIcon/>);
  }

  if (topicName.endsWith('(kWh)') || topicName.endsWith('(kVarh)')) {
    return (<FireIcon/>);
  }

  return (<QuestionMarkCircleIcon/>);
}

function createMomentaryValues(topics) {
  if (!topics) {
    return (
      <Grid
        key={topic}
        xs={12}
        sm={6}
        lg={4}
      >
        <MomentaryValue
          title="No values"
          value="--"
          icon={<NoSymbolIcon/>}
        />
      </Grid>
    );
  }

  const topicNames = Object.keys(topics);
  topicNames.sort((left, right) => {
    const leftActual = localizeTopic(left);
    const rightActual = localizeTopic(right);
    if (leftActual < rightActual) {
      return -1;
    } else if (leftActual > rightActual) {
      return 1;
    } else {
      return 0;
    }
  });

  return topicNames.map((topic) => {
    const values = topics[topic];
    const title = localizeTopic(topic);
    const lastValue = last(values);

    return (
      <Grid
        key={topic}
        xs={12}
        sm={6}
        lg={3}
      >
        <MomentaryValue
          title={title}
          value={lastValue.value}
          received={lastValue.received}
          icon={getIcon(title)}
        />
      </Grid>
    );
  });
}

function Page() {
  const mqtt = useMqtt();

  const momentaryValues = createMomentaryValues(mqtt?.topics);

  return (
    <>
      <Head>
        <title>
          Momentary Values
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
          <Grid
            container
            spacing={3}
          >
            {momentaryValues}
          </Grid>
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
