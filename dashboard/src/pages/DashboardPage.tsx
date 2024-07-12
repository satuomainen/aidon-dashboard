import { useState } from 'react';
import BoltIcon from '@mui/icons-material/Bolt';
import { BottomNavigation, BottomNavigationAction, Box, Button, Paper, Typography } from '@mui/material';
import { CustomTabPanel } from '../components/CustomTabPanel.tsx';
import { clearConnectionParameters } from '../mqtt/connectionParameters.tsx';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';
import MeasurementPanel from '../components/MeasurementPanel.tsx';
import DashboardHeading from '../components/DashboardHeading.tsx';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [ tabNumber, setTabNumber ] = useState(1);
    const mqtt = useMqtt();

    function onDisconnect() {
        clearConnectionParameters();
        mqtt.disconnect();
        navigate('/', { replace: true });
    }

    return (
        <>
            <Box>
                <DashboardHeading/>
                <CustomTabPanel value={tabNumber} index={1}>
                    <MeasurementPanel topics={Object.values(mqtt.topics).filter(({ unit }) => unit === 'kW')}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabNumber} index={2}>
                    <MeasurementPanel topics={Object.values(mqtt.topics).filter(({ unit }) => unit === 'A')}/>
                </CustomTabPanel>
                <CustomTabPanel value={tabNumber} index={3}>
                    <Paper>
                        <Typography variant="h4" paddingTop={2} paddingBottom={1}>
                            Really disconnect?
                        </Typography>
                        <Typography variant="body1" paddingBottom={1}>
                            Disconnecting will also clear your stored connection parameters.
                        </Typography>
                        <Typography variant="body1" paddingBottom={2}>
                            Are you sure you want to disconnect?
                        </Typography>
                        <Button variant="contained" onClick={onDisconnect} sx={{marginBottom:3}}>Disconnect</Button>
                    </Paper>
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
                    <BottomNavigationAction value={1} label="Power" icon={<BoltIcon/>}/>
                    <BottomNavigationAction value={2} label="Currents" icon={<ElectricalServicesIcon/>}/>
                    <BottomNavigationAction value={3} label="Disconnect" icon={<PowerOffIcon/>}/>
                </BottomNavigation>
            </Paper>

        </>
    );
}
