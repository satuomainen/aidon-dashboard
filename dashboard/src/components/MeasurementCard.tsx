import { Card, CardContent, Typography } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ReactNode } from 'react';

function timestampToString(timestamp: number): string {
    const date = new Date(timestamp);
    const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return `${dateString} ${timeString}`;
}

interface MeasurementCardProps {
    metric: string;
    unit: string;
    value: string;
    lastUpdated?: number;
}

const icons: {[key: string]: ReactNode} = {
    'A': <ElectricalServicesIcon/>,
    'kW': <ElectricBoltIcon/>,
};

export default function MeasurementCard(props: Readonly<MeasurementCardProps>) {
    const { metric, unit, value, lastUpdated } = props;
    return (
        <Card sx={{ minWidth: 275, marginBottom: 3, display: 'flex', alignItems: 'stretch' }} raised>
            <CardContent sx={{ backgroundColor: '#2a80bf', color: '#fff', display: 'flex', alignItems: 'center' }}>
                {icons[unit] ?? <QuestionMarkIcon/>}
            </CardContent>
            <CardContent sx={{ alignItems: 'start' }}>
                <Typography textAlign="left" component="div" sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                    {metric}
                </Typography>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h4" component="span" sx={{ marginRight: 0.5 }}>{value}</Typography>
                    <Typography sx={{ fontSize: 18, mb: 1.5 }} color="text.secondary" component="span">
                        {unit}
                    </Typography>
                </div>
                {lastUpdated &&
                    <Typography component="div" sx={{ fontSize: 14 }} color="text.secondary">
                        {timestampToString(lastUpdated)}
                    </Typography>
                }
            </CardContent>
        </Card>
    );
}
