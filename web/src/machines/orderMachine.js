import { createMachine } from "xstate";

const OrderStates = {
    Created: 'Created',
    Confirmed: 'Confirmed',
    Delivered: 'Confirmed',
    Canceled: 'Canceled'
}

export const createOrderMachine = ({ id, price, status, amount, txId }) => createMachine({
    id: 'order',
    initial: OrderStates.Created,
    context: {
        id, 
        price, 
        status,
        amount, 
        txId
    },
    states: {
        [OrderStates.Created]: {
            on: {
                
            }
        }
    }
})