import { TransakApi } from '../apis'
import { TransakFiatCurrencies, transakFiatCurrencies } from '../stores'

const FILTERED_PAYMENT_OPTIONS = ['apple_pay', 'google_pay']

export async function updateTransakFiatCurrencies(): Promise<void> {
    const api = new TransakApi()
    const { response } = (await api.getFiatCurrencies()) ?? {}

    transakFiatCurrencies.set(
        response?.reduce((acc, val) => {
            return {
                ...acc,
                [val.symbol]: {
                    paymentOptions: val.paymentOptions
                        .filter((option) => !FILTERED_PAYMENT_OPTIONS.includes(option.id) && option.isActive)
                        .map(({ id, minAmount, maxAmount }) => {
                            return { id, minAmount, maxAmount }
                        }),
                },
            }
        }, {} as TransakFiatCurrencies)
    )
}
