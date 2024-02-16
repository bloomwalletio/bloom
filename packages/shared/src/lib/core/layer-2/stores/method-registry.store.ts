import { persistent } from '@core/utils'

export const methodRegistry = persistent<{ [signature: string]: string }>('methodRegistry', {})
