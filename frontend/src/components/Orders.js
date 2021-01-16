import React, { Fragment } from 'react';
import Indicator from './Indicator';
import OrdersList from './OrdersGrid';

export default function OrdersPage() {
  return (
    <Fragment>
      <Indicator />
      <OrdersList />
    </Fragment>
  )
}