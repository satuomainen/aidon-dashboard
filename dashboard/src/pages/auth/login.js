import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useMqtt } from '../../hooks/use-mqtt';

const Page = () => {
  const router = useRouter();
  const mqtt = useMqtt();
  const formik = useFormik({
    initialValues: {
      brokerUrl: process.env.MQTT_BROKER_URL,
      topic: process.env.MQTT_TOPIC_PREFIX,
      submit: null
    },
    validationSchema: Yup.object({
      brokerUrl: Yup
        .string()
        .max(255)
        .required('Broker URL is required'),
      topic: Yup
        .string()
        .max(255)
        .required('Topic is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await mqtt.connect(values.brokerUrl, values.topic);
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>

        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Get started!
              </Typography>
            </Stack>
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.brokerUrl && formik.errors.brokerUrl)}
                    fullWidth
                    helperText={formik.touched.brokerUrl && formik.errors.brokerUrl}
                    label="MQTT Broker URL"
                    name="brokerUrl"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="url"
                    value={formik.values.brokerUrl}
                  />
                  <TextField
                    error={!!(formik.touched.topic && formik.errors.topic)}
                    fullWidth
                    helperText={formik.touched.topic && formik.errors.topic}
                    label="Topic prefix"
                    name="topic"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.topic}
                  />
                </Stack>
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Start receiving readings
                </Button>
              </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
