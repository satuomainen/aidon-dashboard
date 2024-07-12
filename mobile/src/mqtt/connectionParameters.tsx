export interface MqttConnectionParameters {
    brokerUrl: string;
    topicPrefix: string;
    rememberMe?: boolean;
}

export function saveConnectionParameters(parameters: MqttConnectionParameters) {
    localStorage.setItem('brokerUrl', parameters.brokerUrl);
    localStorage.setItem('topicPrefix', parameters.topicPrefix);
    localStorage.setItem('rememberMe', parameters.rememberMe ? 'true' : '');
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

    const rememberMe = Boolean(localStorage.getItem('rememberMe'));

    return {
        brokerUrl,
        topicPrefix,
        rememberMe
    };
}

export function clearConnectionParameters() {
    localStorage.removeItem('brokerUrl');
    localStorage.removeItem('topicPrefix');
    localStorage.removeItem('rememberMe');
}
