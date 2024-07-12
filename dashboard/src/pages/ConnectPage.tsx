import { Box, Button, Grid, Paper, styled, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import {
    MqttConnectionParameters,
    readConnectionParameters,
    saveConnectionParameters,
} from '../mqtt/connectionParameters.tsx';
import { TextInput } from '../components/TextInput.tsx';
import { Toggle } from '../components/Toggle.tsx';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';
import { useState } from 'react';

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
    const mqttCtx = useMqtt();
    const [ connectionError, setConnectionError ] = useState<string>();

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
            setConnectionError(undefined);
            navigate('/dashboard');
        } catch (err) {
            setConnectionError(`Failed to connect: ${(err as Error).message}.`);
        }
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" height="100vh">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onConnect)}>
                    <Grid container spacing={1}>
                        {connectionError && (
                            <Grid xs={12} item>
                                <Item>
                                    <Typography color='red'>
                                        {connectionError}
                                    </Typography>
                                </Item>
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
