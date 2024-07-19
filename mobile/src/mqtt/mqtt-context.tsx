import { createContext, ReactNode, useCallback, useMemo, useReducer } from 'react';
import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';
import { mqttTopics } from './mqtt-topic-config.ts';

export interface Topic {
    name: string;
    localization: string;
    unit?: string;
    value?: string;
    lastUpdated?: number;
}

interface State {
    isConnected: boolean;
    isSubscribed: boolean;
    mqttClient?: MqttClient;
    topics: { [key: string]: Topic };
}

const initialState: State = {
    isConnected: false,
    isSubscribed: false,
    mqttClient: undefined,
    topics: {},
};

interface MqttMessage {
    topic: string;
    value: Topic;
}

interface ActionWithoutPayload {
    type: string;
    payload?: never;
}

interface MessageAction {
    type: string;
    payload: MqttMessage;
}

interface MqttConnectAction {
    type: string;
    payload: MqttClient;
}

type Action = ActionWithoutPayload | MessageAction | MqttConnectAction;

const HANDLERS = {
    HANDLE_MESSAGE: 'HANDLE_MESSAGE',
    CONNECT: 'CONNECT',
    DISCONNECT: 'DISCONNECT',
    SUBSCRIBED: 'SUBSCRIBED',
};

type HandlerFunction = (state: State, action: Action) => State;

type HandlerMap = { [key: string]: HandlerFunction };

const handlers: HandlerMap = {
    [HANDLERS.CONNECT]: (state: State, action: Action) => {
        const mqttClient = (action.payload) as MqttClient;

        const newState: State = {
            ...state,
            isConnected: true,
            mqttClient,
        };

        return newState;
    },
    [HANDLERS.SUBSCRIBED]: (state: State) => {
        const newState: State = {
            ...state,
            isSubscribed: true,
        };

        return newState;
    },
    [HANDLERS.DISCONNECT]: (state: State) => {
        const newState: State = {
            ...state,
            isConnected: false,
            isSubscribed: false,
            mqttClient: undefined,
            topics: {},
        };

        return newState;
    },
    [HANDLERS.HANDLE_MESSAGE]: (state: State, action: Action) => {
        const messageAction = action as MessageAction;
        const { topic, value } = messageAction.payload;

        return {
            ...state,
            topics: {
                ...state.topics,
                [topic]: value,
            },
        };
    },
};

const reducer = (state: State, action: Action): State => {
    return handlers?.[action.type](state, action) ?? state;
};

const topicsToDiscardRegExp = RegExp(/diagnostic|debug/);

function shouldDiscard(topic: string) {
    return topicsToDiscardRegExp.exec(topic);
}

// The role of this context is to handle MQTT connection and messages

export interface MqttContextProviderProps {
    isConnected: boolean;
    topics: { [key: string]: Topic };
    connect: (brokerUrl: string, topicPrefix: string) => Promise<void>;
    disconnect: () => void;
}

export const MqttContext = createContext<MqttContextProviderProps>({
    isConnected: false,
    topics: {},
    connect: () => Promise.resolve(),
    disconnect: () => undefined,
});

export interface MqttProviderProps {
    children?: ReactNode;
}

export const MqttProvider = (props: MqttProviderProps) => {
    const { children } = props;
    const [ state, dispatch ] = useReducer(reducer, initialState);

    function handleMessage(topic: string, messageBuffer: Buffer) {
        if (shouldDiscard(topic)) {
            return;
        }

        const displayTopic = mqttTopics.find(({ name }) => topic.endsWith(name));
        if (!displayTopic) {
            console.log('no display topic found for topic', topic);
            return;
        }

        const message: Topic = {
            ...displayTopic,
            value: messageBuffer.toString(),
            lastUpdated: new Date().getTime(),
        };

        const payload: MqttMessage = {
            topic,
            value: message,
        };

        dispatch({
            type: HANDLERS.HANDLE_MESSAGE,
            payload,
        });

        console.log(`MQTT ${topic}: ${message.value}`);
    }

    const connect = useCallback((brokerUrl: string, topicPrefix: string) => {
        console.log('mqtt connect...');
        if (state.isConnected) {
            console.log('mqtt already connected, not connecting again');
            return Promise.resolve();
        }

        const mqttClient = mqtt.connect(brokerUrl);

        return new Promise<void>((resolve, reject) => {
            mqttClient.on('connect', () => {
                dispatch({
                    type: HANDLERS.CONNECT,
                    payload: mqttClient,
                });

                console.log('mqtt connect OK');

                if (state.isSubscribed) {
                    console.log('mqtt already subscribed, not subscribing again');
                    return resolve();
                }

                const failedTopics: string[] = [];
                mqttTopics
                    .map(({ name }) => `${topicPrefix}/sensor/${name}`)
                    .forEach(topic => mqttClient.subscribe(topic, (err) => {
                        if (err) {
                            console.log(`Failed to subscribe topic '${topic}'`, err.message);
                            failedTopics.push(topic);
                        } else {
                            console.log(`subscribed '${topic}'`);
                        }
                    }));

                if (failedTopics.length > 0) {
                    return reject(new Error(`Failed to subscribe: ${failedTopics.join(', ')}`));
                }

                mqttClient.on('message', handleMessage);

                return resolve();
            });
        });

    }, [ state.isConnected, state.isSubscribed ]);

    const disconnect = useCallback(() => {
        if (state.mqttClient) {
            dispatch({
                type: HANDLERS.DISCONNECT,
            });

            state.mqttClient.unsubscribe('#');
            state.mqttClient.end();

            console.log('disconnected from mqtt broker');
        }
    }, [ state.mqttClient ]);

    const mqttProviderValue = useMemo<MqttContextProviderProps>(() => ({
        isConnected: state.isConnected,
        topics: state.topics,
        connect,
        disconnect,
    }), [ state.isConnected, state.topics, connect, disconnect ]);

    return (
        <MqttContext.Provider value={mqttProviderValue}>
            {children}
        </MqttContext.Provider>
    );
};
