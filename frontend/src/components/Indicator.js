import { useService } from '@xstate/react';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import CountUp from "react-countup";
import UserMachineContext from '../shared/context';

export default function Indicator() {
  const service = useContext(UserMachineContext);
  const [current, send] = useService(service);
  const { statistic = {} } = current.context;
  const { total = 0, Confirmed = 0, Canceled = 0, Delivered = 0 } = statistic;

  return (
    <section className='indicator-box'>
      <Row style={{ marginRight: "-5px" }}>
        <Col md={3}>
          <div className="grid-col">
            <div style={{ fontSize: 20 }}>Total</div>
            <h2 style={{ color: "rgb(89, 63, 128)" }}>
              <CountUp start={0} end={total} duration={2} separator="." />
            </h2>
          </div>
        </Col>
        <Col md={3}>
          <div className="grid-col">
            <div style={{ fontSize: 20 }}>Confirmed</div>
            <h2 style={{ color: "rgb(189, 33, 48)" }}>
              <CountUp start={0} end={Confirmed} duration={2} separator="." />
            </h2>
          </div>
        </Col>
        <Col md={3}>
          <div className="grid-col">
            <div style={{ fontSize: 20 }}>Canceld</div>
            <h2 style={{ color: "rgb(189, 189, 189)" }}>
              <CountUp start={0} end={Canceled} duration={2} separator="." />
            </h2>
          </div>
        </Col>
        <Col md={3}>
          <div className="grid-col">
            <div style={{ fontSize: 20 }}>Delivered</div>
            <h2 style={{ color: "rgb(164, 201, 57)" }}>
              <CountUp start={0} end={Delivered} duration={2} separator="." />
            </h2>
          </div>
        </Col>
      </Row>
    </section>
  )
}