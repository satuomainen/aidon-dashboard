import { Navigate, Outlet } from 'react-router-dom';
import { useMqtt } from '../mqtt/use-mqtt.ts';

export default function MainLayout() {
    const mqttCtx = useMqtt();

    if (mqttCtx.isConnected) {
        return (
            <>
                <Navigate to="dashboard" replace/>
                <Outlet/>
            </>
        );
    }

    return (
        <>
            <Navigate to="connect" replace/>
            <Outlet/>
        </>
    );
}
