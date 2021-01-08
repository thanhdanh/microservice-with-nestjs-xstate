export const MessagesTransport = {
    initPayment: 'init_process_payment'
}

export const InternalEvents = {
    ORDER_CREATED: 'order.created',
    ORDER_CONFIRMED: 'order.confirmed',
    ORDER_CANCELED: 'order.canceled',
}

// 15s
export const REQUEST_TIMEOUT = 15000;

// 3s
export const DELIVERY_TIME = 3000;

export enum TransactionStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    DECLINED = 'declined',
}