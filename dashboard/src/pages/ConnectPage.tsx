import { Box, Button, Grid, Paper, styled } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
    MqttConnectionParameters,
    readConnectionParameters,
    saveConnectionParameters,
} from '../mqtt/connectionParameters.tsx';
import { TextInput } from '../components/TextInput.tsx';
import { Toggle } from '../components/Toggle.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';

const emptyConnectionParameters: MqttConnectionParameters = {
    brokerUrl: '',
    topicPrefix: '',
    rememberMe: false, // TODO: change back to true
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ConnectPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const mqttCtx = useMqtt(); // useMqttContext();
    const defaultValues = {
        ...emptyConnectionParameters,
        ...readConnectionParameters(),
    };

    const methods = useForm<MqttConnectionParameters>({ defaultValues });

    async function onConnect(config: MqttConnectionParameters) {
        console.log('onConnect', config);

        if (config.rememberMe) {
            saveConnectionParameters(config);
        }

        try {
            console.log('onConnect', config);
            await mqttCtx.connect(config.brokerUrl, config.topicPrefix);
            navigate('/dashboard');
        } catch (err) {
            console.log('TODO: handle error', err);
        }
    }

    return (
        <Box>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onConnect)}>
                    <Grid container spacing={1}>
                        {location?.state?.error && (
                            <Grid xs={12} item>
                                <Item>Error: {location.state.error}</Item>
                            </Grid>
                        )}
                        <Grid xs={12} item>
                            <Item>
                                <TextInput label="MQTT Broker URL" name="brokerUrl" required/>
                            </Item>
                            <Item>
                                <TextInput label="Topic prefix" name="topicPrefix" required/>
                            </Item>
                            <Item>
                                <Toggle
                                    label="Save values on this device"
                                    name="rememberMe"
                                />
                            </Item>
                            <Item>
                                <Button color="secondary" type="submit">Start</Button>
                            </Item>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
}
