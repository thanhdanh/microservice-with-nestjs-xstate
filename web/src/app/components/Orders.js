import React from 'react';
import { List, Card, Row, Col, Statistic, Radio, Divider, Button } from 'antd';
import BasicLayout from '../layouts/basicLayout';
import { PlusCircleOutlined } from '@ant-design/icons';


const Orders = () => {
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
        <Button type="primary"><PlusCircleOutlined /> Add new order</Button>
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
    </BasicLayout>
  )
}

export default Orders;