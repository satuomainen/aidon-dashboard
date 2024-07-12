import MeasurementCard from './MeasurementCard.tsx';
import { Topic } from '../mqtt/mqtt-context.tsx';

interface MeasurementPanelProps {
    topics: Topic[];
}

export default function MeasurementPanel({ topics }: MeasurementPanelProps) {
    return topics.map((topic: Topic) => (
        <MeasurementCard
            key={topic.name}
            metric={topic.localization}
            unit={topic.unit ?? ''}
            value={topic.value ?? ''}
            lastUpdated={topic.lastUpdated}
        />
    ));
}
