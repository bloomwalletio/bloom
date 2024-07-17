import { TransakApi } from '../apis'
import { ITransakApiPriceParams } from '../interfaces'

export async function getTransakPrice(
    params: ITransakApiPriceParams
): Promise<{ fiatAmount: number; cryptoAmount: number } | undefined> {
    const transakApi = new TransakApi()
    const { response } = (await transakApi.getPrices(params)) ?? {}

    if (!response) {
        return
    }

    const { cryptoAmount, fiatAmount } = response

    return { fiatAmount, cryptoAmount }
}
