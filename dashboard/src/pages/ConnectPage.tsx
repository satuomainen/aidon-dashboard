import {
    Box,
    Button,
    Card,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    styled,
    Switch,
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

const emptyConnectionParameters: MqttConnectionParameters = {
    brokerUrl: '',
    topicPrefix: '',
    rememberMe: true,
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
}));

export default function ConnectPage() {
    const navigate = useNavigate();
    const mqttCtx = useMqtt();
    const [ connectionError, setConnectionError ] = useState<string>();
    const [ connecting, setConnecting ] = useState(false);

    const defaultValues = {
        ...emptyConnectionParameters,
        ...readConnectionParameters(),
    };

    const methods = useForm<MqttConnectionParameters>({ defaultValues });
    const rememberMe = methods.watch('rememberMe');

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
                    <Grid container spacing={1}>
                        {connectionError && (
                            <Grid xs={12} item>
                                <Item>
                                    <Typography color="red">
                                        {connectionError}
                                    </Typography>
                                </Item>
                            </Grid>
                        )}
                        <Card sx={{padding: 3}}>
                            <FormControl component="fieldset" variant="standard">
                                <TextInput label="MQTT Broker URL" name="brokerUrl" required/>
                                <TextInput label="Topic prefix" name="topicPrefix" required/>
                                <FormControlLabel
                                    control={<Switch defaultChecked={rememberMe} name="rememberMe" />}
                                    label="Save values on this device"
                                    sx={{marginBottom: 3}}
                                />
                                <Button
                                    disabled={connecting}
                                    variant="contained"
                                    type="submit"
                                >
                                    Connect
                                </Button>
                            </FormControl>
                        </Card>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
}
