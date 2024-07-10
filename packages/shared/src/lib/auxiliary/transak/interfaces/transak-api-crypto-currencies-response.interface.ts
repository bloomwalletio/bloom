export interface ITransakApiCryptoCurrenciesResponse {
    response: ITransakApiCryptoCurrenciesResponseItem[]
}

export interface ITransakApiCryptoCurrenciesResponseItem {
    _id: string
    coinId: string
    address?: string
    addressAdditionalData?: boolean | { name: string; displayName: string }
    createdAt: string
    decimals: number
    image: ITransakCryptoCurrencyImage
    isAllowed: boolean
    isPopular: boolean
    isStable: boolean
    name: string
    roundOff: number
    symbol: string
    isIgnorePriceVerification: boolean
    image_bk?: ITransakCryptoCurrencyImage
    kycCountriesNotSupported: string[]
    network: { name: string; fiatCurrenciesNotSupported: string[]; chainId?: string | null }
    uniqueId: string
    tokenType: string
    isPayInAllowed: boolean
    isSuspended: boolean
    tokenIdentifier?: string
}

interface ITransakCryptoCurrencyImage {
    large: string
    small: string
    thumb: string
}
