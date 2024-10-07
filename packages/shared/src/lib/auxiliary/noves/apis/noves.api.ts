import { INovesApi } from '../interfaces'
import { NovesForesightApi } from './noves-foresight.api'
import { NovesNodePlusApi } from './noves-nodeplus.api'
import { NovesPricingApi } from './noves-pricing.api'
import { NovesTranslateApi } from './noves-translate.api'

export class NovesApi implements INovesApi {
    translate = new NovesTranslateApi()
    foresight = new NovesForesightApi()
    pricing = new NovesPricingApi()
    nodePlus = new NovesNodePlusApi()
}
