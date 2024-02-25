import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { CustomTabPanel } from '../components/CustomTabPanel.tsx';

export default function DashboardPage() {
    const [value, setValue] = useState<number>(1);

    return (
        <Box>
            <Tabs
                className="main-tabs"
                value={value}
                onChange={(_, newIndex: number) => setValue(newIndex)}
            >
                <Tab label="Power" value={1}/>
                <Tab label="Currents" value={2}/>
                <Tab label="All" value={3}/>
            </Tabs>

            <CustomTabPanel value={value} index={1}>
                Power
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Currents
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                All metrics
            </CustomTabPanel>
        </Box>
    );
}
