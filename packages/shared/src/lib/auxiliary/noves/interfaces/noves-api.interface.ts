import { INovesTranslateApi } from './noves-translate-api.interface'
import { INovesForesightApi } from './noves-foresight-api.interface'
import { INovesPricingApi } from './noves-pricing-api.interface'
import { INovesNodeplusApi } from './noves-nodeplus-api.interface'

export interface INovesApi {
    translate: INovesTranslateApi
    foresight: INovesForesightApi
    pricing: INovesPricingApi
    nodePlus: INovesNodeplusApi
}
