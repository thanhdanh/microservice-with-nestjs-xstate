import { useMachine } from '@xstate/react';
import { Layout, Typography } from 'antd';
import React, { useEffect } from 'react';
import { interpret } from 'xstate';
import { rootMachine } from '../../machines';
import { from, Observable, Subject } from 'rxjs';

import SelectUser from './SelectUser';
import { globalSubject } from '../../services';
const { Title } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const [current] = useMachine(rootMachine);

  globalSubject.authorized.subscribe({
    next: (v) => console.log(`observerA: ${v}`)
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
    </Layout>
  )
}

export default Dashboard;