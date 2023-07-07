import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import mqtt from 'mqtt';

import { last } from '../utils/util';

const HANDLERS = {
  HANDLE_MESSAGE: 'HANDLE_MESSAGE',
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  SUBSCRIBED: 'SUBSCRIBED',
};

const initialState = {
  isConnected: false,
  isSubscribed: false,
  mqttClient: null,
  topics: {},
};

function createTopicValue(message) {
  return {
    value: message,
    received: new Date().getTime(),
  };
}

function ensureMaxValues(values) {
  // 30 was too heavy for the browser (time series view)
  const maxNumberOfValues = 10;
  if (values.length > maxNumberOfValues) {
    values.shift();
  }
}

function getTopicValuesCopy(values, topic) {
  if (!values || !Array.isArray(values[topic])) {
    return [];
  }

  return [...values[topic]];
}

function isTooClose(oldValue, newValue) {
  if (!oldValue) {
    return false;
  }

  if (!newValue?.received) {
    return true;
  }

  const minDurationMs = 60 * 1000;
  const diffMs = newValue.received - oldValue.received;

  return diffMs < minDurationMs;
}

const handlers = {
  [HANDLERS.CONNECT]: (state, action) => {
    const mqttClient = action.payload;

    return {
      ...state,
      isConnected: true,
      mqttClient,
    };
  },
  [HANDLERS.SUBSCRIBED]: (state) => {
    return {
      ...state,
      isSubscribed: true,
    }
  },
  [HANDLERS.DISCONNECT]: (state) => {
    return {
      ...state,
      isConnected: false,
      isSubscribed: false,
      mqttClient: null,
      topics: {}
    };
  },
  [HANDLERS.HANDLE_MESSAGE]: (state, action) => {
    const { topic, value } = action.payload;
    const topicValues = getTopicValuesCopy(state.topics, topic);

    const latestValue = last(topicValues);
    if (isTooClose(latestValue, value)) {
      console.log('dropping value because it is too close to previous');
      return state;
    }

    topicValues.push(value);
    ensureMaxValues(topicValues);

    const topics = {
      ...state.topics,
      [topic]: topicValues,
    };

    return {
      ...state,
      topics,
    }
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

function shouldDiscard(topic) {
  return topic.match(/diagnostic|debug/);
}

// The role of this context is to handle MQTT connection and messages

export const MqttContext = createContext({ undefined });

export const MqttProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const connect = (brokerUrl, topic) => {
    console.log('mqtt connect...');
    if (state.isConnected) {
      console.log('mqtt already connected, not connecting again');
      return Promise.resolve();
    }

    const mqttClient = mqtt.connect(brokerUrl);

    return new Promise((resolve, reject) => {
      mqttClient.on('connect', () => {
        dispatch({
          type: HANDLERS.CONNECT,
          payload: mqttClient
        });

        console.log('mqtt connect OK');

        if (state.isSubscribed) {
          console.log('mqtt already subscribed, not subscribing again');
          return resolve();
        }

        mqttClient.subscribe(`${topic}/#`, (err) => {
          if (err) {
            console.log('Failed to subscribe', err.message);
            return reject(err);
          }

          mqttClient.on('message', (topic, messageBuffer, x) => {
            if (shouldDiscard(topic)) {
              return;
            }

            const message = messageBuffer.toString();
            const value = createTopicValue(message);
            const payload = {
              topic,
              value,
            };

            dispatch({
              type: HANDLERS.HANDLE_MESSAGE,
              payload,
            });

            console.log(`MQTT ${topic}: ${message}`);
          });

          console.log('subscribe OK');
          return resolve();
        });
      });
    })

  };

  const disconnect = () => {
    if (state.mqttClient) {
      dispatch({
        type: HANDLERS.DISCONNECT,
      });

      state.mqttClient.end();

      console.log('disconnected from mqtt broker');
    }
  };

  return (
    <MqttContext.Provider
      value={{
        isConnected: state.isConnected,
        topics: state.topics,
        connect,
        disconnect,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

MqttProvider.propTypes = {
  children: PropTypes.node
};

export const MqttConsumer = MqttContext.Consumer;

export const useMqttContext = () => useContext(MqttContext);
