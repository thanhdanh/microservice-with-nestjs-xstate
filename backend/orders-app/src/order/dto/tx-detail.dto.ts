import { TransactionStatus } from "src/constants";

export class TransactionDetailDto {
    txId: string;
    orderId: number;
    totalCost?: number = 0;
    status?: TransactionStatus = TransactionStatus.PENDING;
    createdDate: Date;

    constructor() {
        // Example: 'tx-u4xu4hk68'
        this.txId = 'tx-' + Math.random().toString(36).substr(2, 9);
        this.createdDate = new Date();
    }
}