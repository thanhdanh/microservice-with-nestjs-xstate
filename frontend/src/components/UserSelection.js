import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export default function UserSelection({ users = [], onSelect }) {
  return (
    <div style={{ border: '2px dashed #212121', padding: 20 }}>
      <Form.Group as={Row} style={{ marginBottom: 0 }}>
        <Form.Label column sm="3" style={{ textAlign: 'right' }}>Select a user</Form.Label>
        <Col sm="9">
          <Form.Control size="sm" as="select" onChange={e => onSelect(e.target.value)}>
            <option disabled>Select one</option>
            {users.length > 0 ? users.map((user, index) => <option key={user.id} value={user.name}>{index}. {user.name}</option>) : <option>No user</option>}
          </Form.Control>
        </Col>
      </Form.Group>
    </div>

  )
}