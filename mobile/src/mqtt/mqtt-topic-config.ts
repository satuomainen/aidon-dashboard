import { Topic } from './mqtt-context.tsx';

/**
 * Configure topics to subscribe and store in the state
 */
export const mqttTopics: Readonly<Topic[]> = [
    {
        name: 'momentary_active_export/state',
        localization: 'Active Export',
        unit: 'kW',
    },
    {
        name: 'momentary_active_import/state',
        localization: 'Active Import',
        unit: 'kW',
    },
    {
        name: 'current_phase_1/state',
        localization: 'Current L1',
        unit: 'A',
    },
    {
        name: 'current_phase_2/state',
        localization: 'Current L2',
        unit: 'A',
    },
    {
        name: 'current_phase_3/state',
        localization: 'Current L3',
        unit: 'A',
    },
];
