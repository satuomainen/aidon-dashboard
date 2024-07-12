import { useEffect } from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { MqttConsumer, MqttProvider } from 'src/contexts/mqtt-context';
import { useMqtt } from 'src/hooks/use-mqtt';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import 'simplebar-react/dist/simplebar.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const mqtt = useMqtt();

  useEffect(() => {
    return () => {
      if (mqtt.isConnected) {
        mqtt.disconnect();
      }
    }
  }, []);

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Aidon Readings
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MqttProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MqttConsumer>
              {
                (auth) => auth.isLoading
                  ? <SplashScreen />
                  : getLayout(<Component {...pageProps} />)
              }
            </MqttConsumer>
          </ThemeProvider>
        </MqttProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
