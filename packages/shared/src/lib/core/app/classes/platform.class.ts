import { IPlatform } from '../interfaces'
import { IS_MOBILE } from '../constants'

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']
