import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { inspect } from "@xstate/inspect";
import App from './app/App';
import 'antd/dist/antd.css';

// inspect({
//   iframe: false
// });

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
