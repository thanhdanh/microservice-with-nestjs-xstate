import React, { useEffect } from 'react';
import { useMachine } from "@xstate/react";
import { Container } from "react-bootstrap";

import { appMachine } from './machine/appMachine';
import UserSelection from './components/UserSelection';
import { UserMachineContextProvider } from './shared/context';
import OrdersPage from './components/Orders';
import { socket, SocketContext } from './shared/socketContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [current, send, service] = useMachine(appMachine, { devTools: true });
  useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log(state.value);
      const { userChosen } = state.context;

      console.log('=> userChosen:', userChosen);
    });

    return subscription.unsubscribe;
  }, [service]);

  const { listUsers, userChosen } = current.context;

  const onSelectUser = (value) => {
    send('SELECT_USER', { value })
  }

  const handleAddUser = (value) => {
    send('ADD_USER', { value })
  }

  return (
    <UserMachineContextProvider value={userChosen}>
      <SocketContext.Provider value={socket}>
        <div className="App">
          <Container style={{ maxWidth: 900 }}>
            <main>
              <h1>Orders Management App</h1>
              <UserSelection users={listUsers} onSelect={onSelectUser} onCreateUser={handleAddUser} />
              <div>{userChosen && <OrdersPage />}</div>
            </main>
            <ToastContainer />
          </Container>
        </div>
      </SocketContext.Provider>
    </UserMachineContextProvider>
  );
}
