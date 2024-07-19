import {
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    Typography,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
    MqttConnectionParameters,
    readConnectionParameters,
    saveConnectionParameters,
} from '../mqtt/connectionParameters.tsx';
import { TextInput } from '../components/TextInput.tsx';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';
import { useState } from 'react';
import { Switch } from '../components/Switch.tsx';

const emptyConnectionParameters: MqttConnectionParameters = {
    brokerUrl: '',
    topicPrefix: '',
    rememberMe: true,
};

export default function ConnectPage() {
    const navigate = useNavigate();
    const mqttCtx = useMqtt();
    const [ connectionError, setConnectionError ] = useState<string | undefined>();
    const [ connecting, setConnecting ] = useState(false);

    const defaultValues = {
        ...emptyConnectionParameters,
        ...readConnectionParameters(),
    };

    const methods = useForm<MqttConnectionParameters>({ defaultValues });

    async function onConnect(config: MqttConnectionParameters) {
        setConnecting(true);
        if (config.rememberMe) {
            saveConnectionParameters(config);
        }

        try {
            await mqttCtx.connect(config.brokerUrl, config.topicPrefix);
            setConnectionError(undefined);
            navigate('/dashboard');
        } catch (err) {
            setConnectionError(`Failed to connect: ${(err as Error).message}.`);
        }
        setConnecting(false);
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onConnect)}>
                    <Grid container spacing={1} display="flex" flexDirection="column">
                        <Card sx={{ padding: 3 }}>
                            <FormControl component="fieldset" variant="standard">
                                <Typography variant="h5" sx={{paddingBottom: 3}}>Aidon HAN Readings</Typography>
                                <TextInput label="MQTT Broker URL" name="brokerUrl" required/>
                                <TextInput label="Topic prefix" name="topicPrefix" required/>
                                <Switch name="rememberMe" label="Save values on this device"/>
                                <Button
                                    disabled={connecting}
                                    variant="contained"
                                    type="submit"
                                >
                                    Connect
                                </Button>
                                {connectionError &&
                                    <Typography sx={{ paddingTop: 2 }} color="red">
                                        {connectionError}
                                    </Typography>
                                }
                            </FormControl>
                        </Card>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
}
