import { get } from 'svelte/store'
import { sleep } from '@core/utils/os'
import { CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL, CHECK_PREVIOUS_MANAGER_IS_DESTROYED_TIMEOUT } from '../constants'
import { isDestroyingManager } from '../stores'

export async function waitForPreviousManagerToBeDestroyed(): Promise<void> {
    const maxCount = CHECK_PREVIOUS_MANAGER_IS_DESTROYED_TIMEOUT / CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL
    for (let count = 0; count < maxCount; count++) {
        if (!get(isDestroyingManager)) {
            return Promise.resolve()
        }
        await sleep(CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL)
    }
    return Promise.reject()
}
