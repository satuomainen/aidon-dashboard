# Aidon Dashboard

This app is based on the free version of
[material-kit-react](https://github.com/devias-io/material-kit-react). Big
thanks and kudos to you [Devias](https://devias.io) for making an awesome
user experience!

This a prototype app that allows connecting to an MQTT server and then
subscribe to all topics under a topic prefix. Anything received under the
prefix is visualized as momentary values (latest value received) as well as
a limited time series line graph for the last 10 received values.

## Configure

To conveniently populate the MQTT broker address and the topic prefix fields,
you can configure the `.env` file to contain the defaults. Copy the provided
[`.env.example`](./.env) to `.env` and edit the values to match your
configuration:

```
MQTT_BROKER_URL=wss://broker.hivemq.com:8884/mqtt
MQTT_TOPIC_PREFIX=yourTopicPrefix
```

## Development server
 
Have Node 18.x or greater installed. Then say:
```bash
npm install
npm run start
```

## Build for production

Edit [`next.config.js`](./next.config.js) and adjust `basePath` as needed. The
default value assumes the app is going to be installed into `/aidon` and not
the root.

Then say:
```bash
npm run build
npm run export
```

This will create a directory named `out`, which will contain the files that need
to be copied to wherever the app is going to be hosted.
