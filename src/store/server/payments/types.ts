export interface PhonePePayload {
    merchantOrderId: string,
    amount: number,
    expireAfter: number,
    udf1: string,
    udf2: string,
    udf3: number,
    redirectUrl: string,
    env: string,
}
