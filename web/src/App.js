import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Notfound from './components/Notfound';
import OrderDetail from './components/OrderDetail';
import Orders from './components/Orders';
import Dashboard from './components/Dashboard';
import Notification from './components/Notify';

import { BackTop } from 'antd';
import "./styles.css";

import { appMachine } from './machines';
import { interpret } from 'xstate';
import { MachineContextProvider } from './context';

export default function App() {
  const persistedOrderssMachine = appMachine.withConfig({
    actions: {
      persist: (ctx) => {
        try {
          localStorage.setItem("currentContext", JSON.stringify(ctx));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }).withContext({
    ...(() => {
      try {
        return JSON.parse(localStorage.getItem("currentContext"));
      } catch (e) {
        console.error(e);
        return null;
      }
    })()
  })

  const service = interpret(persistedOrderssMachine)
    .onTransition((state) => console.log(state.value))
    .start();

  return (
    <MachineContextProvider value={service}>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/orders/:id" component={OrderDetail} />
          <Route component={Notfound} />
        </Switch>
        <BackTop />
        <Notification />
      </div>
    </MachineContextProvider>
  );
}