import React from 'react';
import { Select, Input, Divider } from 'antd';
import { useMachine } from "@xstate/react";

import { PlusOutlined } from '@ant-design/icons';
import { rootMachine } from '../../machines';

const { Option } = Select;


const SelectUser = () => {
  const [current, send] = useMachine(rootMachine);
  const { userSelected, users, userName } = current.context;

  const addNewUser = () => {
    send({ type: "ADD_USER" });
  }

  const onSelectUser = (value) => {
    send("SELECT_USER", { value });
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

export default SelectUser;
