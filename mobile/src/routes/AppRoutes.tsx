import { Route, Routes} from 'react-router-dom';
import MainLayout from '../layout/MainLayout.tsx';
import ConnectPage from '../pages/ConnectPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route path="connect" element={<ConnectPage/>}/>
                <Route path="dashboard" element={<DashboardPage/>}/>
            </Route>
        </Routes>
    );
}
