import { useEffect, useState } from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { CustomTabPanel } from '../components/CustomTabPanel.tsx';
import {
    clearConnectionParameters,
} from '../mqtt/connectionParameters.tsx';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';
import MeasurementPanel from '../components/MeasurementPanel.tsx';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [ tabNumber, setTabNumber ] = useState(1);
    const mqtt = useMqtt();
    console.log('mqtt topics', mqtt.topics);

    useEffect(() => {
        console.log('DashboardPage useEffect firing, there should be mqtt connection:', mqtt.isConnected);
    }, []);

    function onDisconnect() {
        clearConnectionParameters();
        mqtt.disconnect();
        navigate('/', { replace: true });
    }

    return (
        <Box>
            <Tabs
                className="main-tabs"
                value={tabNumber}
                onChange={(_, newIndex: number) => setTabNumber(newIndex)}
            >
                <Tab label="Power" value={1}/>
                <Tab label="Currents" value={2}/>
                <Tab label="Disconnect" value={3}/>
            </Tabs>

            <CustomTabPanel value={tabNumber} index={1}>
                <MeasurementPanel topics={Object.values(mqtt.topics).filter(({unit}) => unit === 'kW')}/>
            </CustomTabPanel>
            <CustomTabPanel value={tabNumber} index={2}>
                <MeasurementPanel topics={Object.values(mqtt.topics).filter(({unit}) => unit === 'A')}/>
            </CustomTabPanel>
            <CustomTabPanel value={tabNumber} index={3}>
                <div>
                    Disconnecting will also clear your stored connection parameters.
                </div>
                <div>
                    Are you sure you want to disconnect?
                </div>
                <Button onClick={onDisconnect}>Disconnect</Button>
            </CustomTabPanel>
        </Box>
    );
}
