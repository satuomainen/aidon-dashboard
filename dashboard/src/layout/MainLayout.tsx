import { Navigate, Outlet } from 'react-router-dom';
import { readConnectionParameters } from '../mqtt/connection-store.tsx';

export default function MainLayout() {
    const params = readConnectionParameters();
    const shouldConfigureConnectionParams = !params;

    if (shouldConfigureConnectionParams) {
        console.log('gotta connect');
        return <Navigate to="connect"/>;
    }

    return (
        <Outlet/>
    );
}
