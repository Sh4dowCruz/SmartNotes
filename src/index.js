import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { OcrProvider } from './pages/question/OcrContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUDIENCE
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <OcrProvider>
        <App />
      </OcrProvider>
    </Auth0Provider>
  </React.StrictMode>
);
