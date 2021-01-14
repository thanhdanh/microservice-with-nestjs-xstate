import React, { useContext, useEffect, useState } from 'react';
import { List, Card, Row, Col, Statistic, Radio, Divider, Button, Modal, Form, Tag } from 'antd';
import BasicLayout from '../layouts/BasicLayout';
import { FileDoneOutlined, FileExcelOutlined, FileSyncOutlined, PlusCircleOutlined, ScheduleOutlined, ShoppingOutlined } from '@ant-design/icons';
import MachineContext from '../context';
import { useService } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import CreateOrderForm from './CreateOrderForm';

const { Meta } = Card;

const OrderStatus = {
  CREATED: 'Created',
  CONFIRMED: 'Confirmed',
  CANCELED: 'Canceled',
  DELIVERED: 'Delivered'
}

function filterOrders(filter, orders = []) {
  if (!filter || filter === 'all') {
    return orders;
  }

  return orders.filter(order => order.status === filter);
}

function getIconByStatus(status = OrderStatus.CREATED) {
  const color = getColorByStatus(status);
  switch (status) {
    case OrderStatus.DELIVERED:
      return <ScheduleOutlined color={color} width={80} />
    case OrderStatus.CONFIRMED:
      return <FileDoneOutlined color={color} width={80} />
    case OrderStatus.CANCELED:
      return <FileExcelOutlined color={color} width={80} />
    default:
      return <FileSyncOutlined color={color} width={80} />
  }
}

function getColorByStatus(status = OrderStatus.CREATED) {
  switch (status) {
    case OrderStatus.DELIVERED:
      return '#389e0d';
    case OrderStatus.CONFIRMED:
      return '#08979c';
    case OrderStatus.CANCELED:
      return '#f5222d';
    default:
      return '';
  }
}

const Orders = () => {
  const service = useContext(MachineContext);
  const [current, send] = useService(service);
  const history = useHistory();
  const [form] = Form.useForm();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const { authorized, orders = [], statistic = {} } = current.context;

  if (!authorized) {
    setTimeout(() => {
      history.push('/')
    }, 200)
  }

  useEffect(() => {
    send('FETCH_STATISTIC')
  }, [])

  const onCreateOrder = (values) => {
    send({ type: 'ADD_ORDER', data: values })
    setShowCreateForm(false);
  };

  const filteredOrders = filterOrders(filter, orders);

  return (
    <BasicLayout>
      {/* Statistic */}
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="Total orders" value={statistic.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Confirmed orders" value={statistic.Confirmed} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Canceled orders" value={statistic.Canceled} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Delivered orders" value={statistic.Delivered} />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Orders list filter */}
      <Card title="Orders list" extra={
        <Button type="primary" onClick={() => setShowCreateForm(true)}><PlusCircleOutlined /> Add new order</Button>
      }>
        {/* Orders list */}
        <List
          header={
            <div>
              <Radio.Group buttonStyle="solid" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <Radio.Button value={'all'}>All</Radio.Button>
                <Radio.Button value={OrderStatus.CREATED}>Created</Radio.Button>
                <Radio.Button value={OrderStatus.CONFIRMED}>Confirmed</Radio.Button>
                <Radio.Button value={OrderStatus.CANCELED}>Canceled</Radio.Button>
                <Radio.Button value={OrderStatus.DELIVERED}>Delivered</Radio.Button>
              </Radio.Group>
            </div>
          }
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={filteredOrders}
          renderItem={item => (
            <List.Item style={{ marginTop: 20 }}>
              <Card 
                size='small'
                hoverable
              >
                <Meta 
                  avatar={
                    getIconByStatus(item.status)
                  }
                  title={
                    `Order #${item.id}`
                  }
                  description={
                    <div>
                      <p>Amount: {item.amount} <b>(Price {item.price} USD)</b></p>
                      <h4><Tag color={getColorByStatus(item.status)}>{item.status}</Tag></h4>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
      <Modal
        title="Create a new order"
        okText="Create"
        cancelText="Cancel"
        visible={showCreateForm}
        onCancel={() => setShowCreateForm(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreateOrder(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <CreateOrderForm form={form} />
      </Modal>
    </BasicLayout>
  )
}

export default Orders;