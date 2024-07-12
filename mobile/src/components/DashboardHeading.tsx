import { readConnectionParameters } from '../mqtt/connectionParameters.tsx';

export default function DashboardHeading() {
    const config = readConnectionParameters()
    return (
        <h3 className="dashboard-heading">Aidon HAN Readings - {config?.topicPrefix}</h3>
    );
}
