import { Layout, Typography } from 'antd';
import React, { useContext } from 'react';
import { AppMachineProvider } from '../App';

import SelectUser from './SelectUser';
const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const service = useContext(AppMachineProvider);
  const [current] = useService(service);


  return (
    <Layout className="layout">
      <Content style={{ padding: '70px 50px', textAlign: 'center' }}>
        <Title level={2}>
          Orders Opertions Portal
        </Title>

        <Title level={4}>
          Select or create new user
        </Title>
        <SelectUser />
      </Content>
    </Layout>
  )
}

export default Dashboard;