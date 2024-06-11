import { BaseApi } from '@core/utils'

interface IIpApiResponse {
    ip: string
    network: string
    version: string
    city: string
    region: string
    region_code: string
    country: string
    country_name: string
    country_code: string
    country_code_iso3: string
    country_capital: string
    country_tld: string
    continent_code: string
    in_eu: boolean
    postal: string
    latitude: number
    longitude: number
    timezone: string
    utc_offset: string
    country_calling_code: string
    currency: string
    currency_name: string
    languages: string
    country_area: number
    country_population: number
    asn: string
    org: string
}

export class CountryApi extends BaseApi {
    constructor() {
        super('https://ipapi.co')
    }

    async getCountryCode(): Promise<string | undefined> {
        const ipData = await this.get<IIpApiResponse>('json')
        return ipData?.country_code
    }
}