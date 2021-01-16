import React, { useState } from 'react';
import { Col, Form, Row, Button, InputGroup, FormControl } from 'react-bootstrap';

export default function UserSelection({ users = [], onSelect, onCreateUser }) {
  const [userName, setUserName] = useState();

  return (
    <div style={{ border: '2px dashed #212121', padding: 20 }}>
      <Row>
        <Col md={7}>
          <Form.Group as={Row} style={{ marginBottom: 0 }}>
            <Form.Label column sm="4" style={{ textAlign: 'right' }}>Select a user</Form.Label>
            <Col sm="8">
              <Form.Control size="sm" as="select" onChange={e => onSelect(e.target.value)}>
                <option disabled>Select one</option>
                {users.length > 0 ? users.map((user, index) => <option key={user.id} value={user.name}>{index}. {user.name}</option>) : <option>No user</option>}
              </Form.Control>
            </Col>
          </Form.Group>
        </Col>
        <Col>
          <InputGroup className="mb-2">
            <FormControl size="sm" value={userName} id="username" name="username" placeholder="Username" onChange={e => setUserName(e.target.value)} />
            <InputGroup.Append>
              <Button size="sm" onClick={() => { onCreateUser(userName); setUserName(null); }}>Add user</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

    </div>

  )
}