import { MqttGuard } from 'src/guards/mqtt-guard';

export const withMqttGuard = (Component) => (props) => (
  <MqttGuard>
    <Component {...props} />
  </MqttGuard>
);