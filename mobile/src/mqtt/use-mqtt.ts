import { useContext } from 'react';
import { MqttContext } from './mqtt-context.tsx';

export const useMqtt = () => useContext(MqttContext);
