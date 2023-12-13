import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'

export const lastLoggedInProfileId = persistent<string | undefined>('lastLoggedInProfileId', undefined)

export function getLastLoggedInProfileId(): string | undefined {
    return get(lastLoggedInProfileId)
}
