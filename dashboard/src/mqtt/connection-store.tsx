export interface MqttConnectionParameters {
    brokerUrl: string;
    topicPrefix: string;
}

export function saveConnectionParameters(parameters: MqttConnectionParameters) {
    Object.entries(parameters).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
}

export function readConnectionParameters(): MqttConnectionParameters | undefined {
    const brokerUrl = localStorage.getItem('brokerUrl');
    if (!brokerUrl) {
        return undefined;
    }

    const topicPrefix = localStorage.getItem('topicPrefix');
    if (!topicPrefix) {
        return undefined;
    }

    return {
        brokerUrl,
        topicPrefix,
    };
}

export function clearConnectionParameters() {
    localStorage.removeItem('brokerUrl');
    localStorage.removeItem('topicPrefix');
}
