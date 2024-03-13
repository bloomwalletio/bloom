export interface ITransakWindowData {
    currency: string
    address: string
    service: 'BUY' | 'SELL'
    amount: number
}
