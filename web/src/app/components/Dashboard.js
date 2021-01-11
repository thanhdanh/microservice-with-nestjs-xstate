import { useMachine } from '@xstate/react';
import { Layout, Typography } from 'antd';
import React, { useEffect } from 'react';
import { interpret } from 'xstate';
import { rootMachine } from '../../machines';
import Notification from './Notify';

import SelectUser from './SelectUser';
const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const [state] = useMachine(rootMachine)
  
  const service = interpret(rootMachine).onTransition(state => {
    console.log(
      'State -> ', state.value
    )
    console.log(state.context.userSelected);
  });

  useEffect(() => {
    service.start()
    return () =>
    service.stop()
  })

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
      <Notification />
    </Layout>
  )
}

export default Dashboard;