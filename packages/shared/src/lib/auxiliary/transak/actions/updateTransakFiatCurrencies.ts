import { TransakApi } from '../apis'
import { TransakFiatCurrencies, transakFiatCurrencies } from '../stores'
import { getTransakApiUrl } from '../utils'

const FILTERED_PAYMENT_OPTIONS = ['apple_pay', 'google_pay']

export async function updateTransakFiatCurrencies(): Promise<void> {
    const apiUrl = getTransakApiUrl()
    const api = new TransakApi(apiUrl)
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
