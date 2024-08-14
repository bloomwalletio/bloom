import { TransakApi } from '../apis'
import { ITransakApiPriceParams } from '../interfaces'
import { getTransakApiUrl } from '../utils'

export async function getTransakPrice(
    params: ITransakApiPriceParams
): Promise<{ fiatAmount: number; cryptoAmount: number } | undefined> {
    const apiUrl = getTransakApiUrl()
    const api = new TransakApi(apiUrl)
    const { response } = (await api.getPrices(params)) ?? {}

    if (!response) {
        return
    }

    const { cryptoAmount, fiatAmount } = response

    return { fiatAmount, cryptoAmount }
}
