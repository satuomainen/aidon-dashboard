import { Card, CardContent, Typography } from '@mui/material';

interface MeasurementCardProps {
    metric: string;
    unit: string;
    value: string;
}

export default function MeasurementCard(props: Readonly<MeasurementCardProps>) {
    const { metric, unit, value } = props;
    return (
        <Card sx={{ minWidth: 275 }} >
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {metric}
                </Typography>
                <Typography variant="h5" component="span">
                    {value}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary" component="span">
                    {unit}
                </Typography>
            </CardContent>
        </Card>
    );
}
