import { useState } from 'react';
import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Paper,
    Typography,
} from '@mui/material';
import { CustomTabPanel } from '../components/CustomTabPanel.tsx';
import { clearConnectionParameters } from '../mqtt/connectionParameters.tsx';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';
import MeasurementPanel from '../components/MeasurementPanel.tsx';
import DashboardHeading from '../components/DashboardHeading.tsx';
import { MqttContextProviderProps, Topic } from '../mqtt/mqtt-context.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import { Switch } from '../components/Switch.tsx';

interface DisconnectFormValues {
    clearConfig: boolean;
}

function DisconnectTab({ mqtt }: Readonly<{ mqtt: MqttContextProviderProps }>) {
    const navigate = useNavigate();
    const methods = useForm<DisconnectFormValues>({
        defaultValues: { clearConfig: false },
    });

    function onDisconnect(values: DisconnectFormValues) {
        if (values.clearConfig) {
            clearConnectionParameters();
        }

        mqtt.disconnect();
        navigate('/');
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onDisconnect)}>
                <Paper>
                    <Typography variant="h4" paddingTop={2} paddingBottom={1}>
                        Really disconnect?
                    </Typography>
                    <Switch
                        name="clearConfig"
                        label="Clear saved connection values"
                    />
                    <Typography variant="body1" paddingBottom={2}>
                        Are you sure you want to disconnect?
                    </Typography>
                    <Button variant="contained" type="submit" sx={{ marginBottom: 3 }}>Disconnect</Button>
                </Paper>
            </form>
        </FormProvider>
    );
}

function getTopicsInOrder(topics: Topic[], namePartials: string[]): Topic[] {
    const topicsInOrder: Topic[] = [];

    namePartials.forEach(namePartial => {
        const topic = topics.find(({ name }) => name.includes(namePartial));
        if (topic) {
            topicsInOrder.push(topic);
        }
    });

    return topicsInOrder;
}

export default function DashboardPage() {
    const [ tabNumber, setTabNumber ] = useState(1);
    const mqtt = useMqtt();
    const mqttTopics = Object.values(mqtt.topics);

    const powerTopicsInOrder = getTopicsInOrder(
        mqttTopics,
        [ 'momentary_active_export', 'momentary_active_import' ]);

    const currentTopicsInOrder = getTopicsInOrder(
        mqttTopics,
        [ 'current_phase_1', 'current_phase_2', 'current_phase_3' ]);

    return (
        <>
            <Box>
                <DashboardHeading/>
                <CustomTabPanel value={tabNumber} index={1}>
                    <MeasurementPanel topics={powerTopicsInOrder}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabNumber} index={2}>
                    <MeasurementPanel topics={currentTopicsInOrder}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabNumber} index={3}>
                    <DisconnectTab mqtt={mqtt}/>
                </CustomTabPanel>

            </Box>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={tabNumber}
                    onChange={(_, newValue) => {
                        setTabNumber(newValue);
                    }}
                >
                    <BottomNavigationAction value={1} label="Power" icon={<ElectricBoltIcon/>}/>
                    <BottomNavigationAction value={2} label="Currents" icon={<ElectricalServicesIcon/>}/>
                    <BottomNavigationAction value={3} label="Disconnect" icon={<PowerOffIcon/>}/>
                </BottomNavigation>
            </Paper>

        </>
    );
}
