import React, { useState } from 'react';
import { Button, Col, Form, FormControl, InputGroup } from 'react-bootstrap';

export default function OrderCreateForm({ onSubmit }) {
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    return (
        <Form onSubmit={(e) => onSubmit(e, { amount, price })}>
            <Form.Row className="align-items-center">
                <Col xs="auto">
                    <Form.Control
                        className="mb-2"
                        id="inlineFormInput"
                        placeholder="Amount"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(+e.target.value)}
                        min={0}
                        type="number"
                    />
                </Col>
                <Col>
                    <InputGroup className="mb-2">
                        <InputGroup.Append>
                            <InputGroup.Text>USD</InputGroup.Text>
                        </InputGroup.Append>
                        <FormControl id="inlineFormInputGroup"
                            placeholder="Price"
                            name="price"
                            onChange={(e) => setPrice(+e.target.value)}
                            value={price}
                            min={0}
                            type="number" />
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <Button type="submit" className="mb-2">
                        Add new order
                </Button>
                </Col>
            </Form.Row>
        </Form>
    )
}