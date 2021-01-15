import { useService } from '@xstate/react';
import { Layout, Typography } from 'antd';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import MachineContext from '../context';

import SelectUser from './SelectUser';
const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const service = useContext(MachineContext);
  const [current] = useService(service);
  const history = useHistory()
  const isAuthorized = current.matches('authorized');    

  if (isAuthorized) {
    setTimeout(() => {
      history.push('/orders')
    }, 200)
  }
  
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