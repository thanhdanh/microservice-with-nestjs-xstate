import { useService } from '@xstate/react';
import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Card, CardDeck, Col, Row } from 'react-bootstrap';
import UserMachineContext from '../shared/context';
import { OrderStatus } from '../shared/helpers';
import { SocketContext, MessageSocket } from '../shared/socketContext';
import OrderCard from './OrderCard';
import OrderCreateForm from './OrderCreateForm';

export function filterOrders(filter, orders = []) {
  if (!filter || filter === 'all') {
    return orders;
  }

  return orders.filter(order => order.status === filter);
}

export default function OrdersList() {
  const service = useContext(UserMachineContext);
  const [current, send] = useService(service);
  const [filter, setFilter] = useState('all');

  const handleSubmit = (event, values) => {
    event.preventDefault();
    send('ADD_ORDER', { values })
  }

  const refreshOrders = () => {
    send('FETCH_ORDERS')
  }

  const handleCancelOrder = (id) => {
    send('CANCEL_ORDER', { id })
  }

  const isAcitve = (status) => {
    return filter === status;
  }

  const { orders = [] } = current.context;
  const ordersFilted = filterOrders(filter, orders);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(MessageSocket.NEW_ORDER, (data) => {
      console.log(data)
    }); 
    socket.on(MessageSocket.ORDER_CHANGED_STATUS, (data) => {
      console.log(data)
    }); 
  }, [socket])

  return (
    <CardDeck style={{ marginTop: 20 }}>
      <Card>
        <Card.Header>
          <OrderCreateForm onSubmit={handleSubmit} />
        </Card.Header>
        <Card.Body>
          {
            !orders.length ?
              <div style={{ paddig: 50, textAlign: 'center', marginTop: 30 }}>
                No orders yet
              </div> :
              <div>
                <div style={{ paddingLeft: 15, paddingRight: 8 }}>
                  <ButtonToolbar className="justify-content-between">
                    <Button variant="outline-primary" size="sm" onClick={refreshOrders}>Refresh</Button>

                    <ButtonGroup size="sm" toggle className="mr-2" aria-label="Filter group">
                      <Button active={isAcitve('all')} onClick={() => setFilter('all')}>All</Button>
                      <Button active={isAcitve(OrderStatus.CREATED)} onClick={() => setFilter(OrderStatus.CREATED)}>Created</Button>
                      <Button active={isAcitve(OrderStatus.CONFIRMED)} onClick={() => setFilter(OrderStatus.CONFIRMED)}>Confirmed</Button>
                      <Button active={isAcitve(OrderStatus.CANCELED)} onClick={() => setFilter(OrderStatus.CANCELED)}>Canceled</Button>
                      <Button active={isAcitve(OrderStatus.DELIVERED)} onClick={() => setFilter(OrderStatus.DELIVERED)}>Delivered</Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </div>
                <Row>
                  {ordersFilted.map(order => <Col key={`order.${order.id}`}  md="auto" xs lg="4"><OrderCard detail={order} onCancelOrder={() => handleCancelOrder(order.id)} /></Col>)}
                </Row>
              </div>
          }

        </Card.Body>
      </Card>
    </CardDeck>
  )
}