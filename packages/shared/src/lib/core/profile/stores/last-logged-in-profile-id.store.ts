import { persistent } from '@core/utils/store'

export const lastLoggedInProfileId = persistent<string | undefined>('lastLoggedInProfileId', undefined)
