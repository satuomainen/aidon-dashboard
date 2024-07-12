import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { MqttProvider } from './mqtt/mqtt-context.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MqttProvider>
                <App/>
            </MqttProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
