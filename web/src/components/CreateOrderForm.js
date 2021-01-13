import React from 'react';
import { Form, InputNumber } from 'antd';

export default function CreateOrderForm({ form }) {
    return (
        <Form form={form} layout="inline">
            <Form.Item
                name="amount"
                label="Amount"
                rules={[
                    {
                        required: true,
                        message: 'Please input the amount of order!',
                    },
                ]}
            >
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item
                name="price"
                label="Price"
                rules={[
                    {
                        required: true,
                        message: 'Please input the price of order!',
                    },
                ]}
            >
                <InputNumber 
                    min={0}
                    step={1000} 
                    formatter={value => `${value} USD`}
                    parser={value => value.replace(' USD', '')} 
                />
            </Form.Item>
        </Form>
    )
}