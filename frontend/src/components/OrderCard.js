import React, { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { getColorByStatus, OrderStatus } from './../shared/helpers';

export default function OrderCard({ detail, onCancelOrder }) {
  const { id, status, amount = 0, price = 0 } = detail;
  
  const [timeLeft, setTimeLeft] = useState(10);
  const [btnEnable, setBtnEnable] = useState(false);

  useEffect(() => {
    setBtnEnable(false);

    if (status !== OrderStatus.CREATED) return;
    if (!timeLeft) return;

    setBtnEnable(true);

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Card style={{ marginTop: 15 }} border={getColorByStatus(status)}>
      <Card.Body>
        <Card.Title>Order #{id}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <Badge variant={getColorByStatus(status)}>{status}</Badge>
        </Card.Subtitle>
        <Card.Text>
            <div>Amount: {amount}</div>
            <span>Price: {price} USD </span>
        </Card.Text>
        <Card.Footer>
          {btnEnable ? <Button size='sm' variant='link' onClick={onCancelOrder} disabled={!btnEnable}>Cancel ({timeLeft})</Button> : ''}
        </Card.Footer>
      </Card.Body>
    </Card>
  )
}