import React from 'react';
import ReactDOM from 'react-dom/client';
import { StiggProvider } from '@stigg/react-sdk';
import '@stigg/react-sdk/dist/styles.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StiggProvider
    apiKey={import.meta.env.VITE_STIGG_CLIENT_KEY}
    customerId={import.meta.env.VITE_CUSTOMER_ID} // pass the customer directly
  >
    <App />
  </StiggProvider>
);
