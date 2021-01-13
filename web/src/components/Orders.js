import React, { useContext, useState } from 'react';
import { List, Card, Row, Col, Statistic, Radio, Divider, Button, Modal, Form } from 'antd';
import BasicLayout from '../layouts/BasicLayout';
import { PlusCircleOutlined } from '@ant-design/icons';
import MachineContext from '../context';
import { useService } from '@xstate/react';
import { useHistory } from 'react-router-dom';
import CreateOrderForm from './CreateOrderForm';


const Orders = () => {
  const service = useContext(MachineContext);
  const [current] = useService(service);
  const history = useHistory();
  const [form] = Form.useForm();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAuthorized = !!current?.context?.authorized
  if (!isAuthorized) {
    setTimeout(() => {
      history.push('/')
    }, 200)
  }

  const onCreateOrder = (values) => {
    console.log('Received values of form: ', values);
    setShowCreateForm(false);
  };


  return (
    <BasicLayout>
      {/* Statistic */}
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="Total orders" value={10} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Confirmed orders" value={10} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Canceled orders" value={10} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Delivered orders" value={10} />
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
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="confirmed">Confirmed</Radio.Button>
                <Radio.Button value="canceled">Canceled</Radio.Button>
                <Radio.Button value="delivered">Delivered</Radio.Button>
              </Radio.Group>
            </div>
          }
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={[]}
          renderItem={item => (
            <List.Item>
              <Card title={item.title}>Card content</Card>
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