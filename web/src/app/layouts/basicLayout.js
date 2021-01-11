import { Layout } from 'antd';
import React from 'react';
import Notification from '../components/Notify';
import SelectUser from './../components/SelectUser';

const { Header, Content, Footer } = Layout;

const BasicLayout = ({ children }) => {
  return (
    <Layout className="layout">
      <Header className="header">
        <SelectUser />
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          {children}
        </div>
      </Content>
      <Notification />
      <Footer style={{ textAlign: 'center' }}>Created by YOU</Footer>
    </Layout>
  )
}

export default BasicLayout;