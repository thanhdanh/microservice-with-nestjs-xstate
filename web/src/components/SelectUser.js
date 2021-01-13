import React, { useContext, useEffect } from 'react';
import { Select, Input, Divider } from 'antd';
import { useService } from "@xstate/react";

import { PlusOutlined } from '@ant-design/icons';
import MachineContext from '../context';

const { Option } = Select;


export default function SelectUser() {
  const service = useContext(MachineContext);
  const [current, send] = useService(service);
  const { userSelected, users, userName } = current.context;

  useEffect(() => {
    send('FETCH_USERS')
  }, [])
  
  const addNewUser = () => {
    send({ type: "ADD_USER" });
  }

  const onSelectUser = (value) => {
    send({ type: "SELECT_USER", value });
  }

  const handleUserNameChange = e => {
    send({ type: "INPUT_USER_NAME", value: e.target.value });
  };

  return (
      <Select
        style={{ width: 300 }}
        placeholder="Select user"
        value={userSelected?.name}
        onChange={onSelectUser}
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input style={{ flex: 'auto' }} value={userName} placeholder="ex: Vo Thanh Danh ..." onChange={handleUserNameChange} />
              <a
                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                onClick={addNewUser}
              >
                <PlusOutlined /> Add new user
              </a>
            </div>
          </div>
        )}
      >
        {users && users.map(user => (
            <Option key={`user_${user.id}`} value={user.name}>{user.name}</Option>
          ))}
      </Select>
  )
}