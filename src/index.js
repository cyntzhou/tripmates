import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';

// main app
import App from './containers/App';

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
document.getElementById('react-app'));
