import { useContext } from 'react';
import { MqttContext } from 'src/contexts/mqtt-context';

export const useMqtt = () => useContext(MqttContext);
