import { useRoutes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.tsx';
import ConnectPage from '../pages/ConnectPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';

export default function Routes() {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout/>,
            children: [
                {
                    path: 'connect',
                    element: <ConnectPage/>
                },
                {
                    path: 'dashboard',
                    element: <DashboardPage/>
                }
            ]
        },
    ]);
}
