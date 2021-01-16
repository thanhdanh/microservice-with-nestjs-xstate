export const OrderStatus = {
    CREATED: 'Created',
    CONFIRMED: 'Confirmed',
    CANCELED: 'Canceled',
    DELIVERED: 'Delivered'
}

export function getColorByStatus(status = OrderStatus.CREATED) {
    switch (status) {
        case OrderStatus.DELIVERED:
            return 'success';
        case OrderStatus.CONFIRMED:
            return 'info';
        case OrderStatus.CANCELED:
            return 'danger';
        default:
            return 'primary';
    }
}