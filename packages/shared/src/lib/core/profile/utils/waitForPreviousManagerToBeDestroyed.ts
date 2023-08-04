import { get } from 'svelte/store'
import { sleep } from '@core/utils/os'
import {
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL,
    CHECK_PREVIOUS_MANAGER_IS_DESTROYED_MAX_COUNT,
} from '../constants'
import { isDestroyingManager } from '../stores'

export async function waitForPreviousManagerToBeDestroyed(): Promise<void> {
    for (let count = 0; count < CHECK_PREVIOUS_MANAGER_IS_DESTROYED_MAX_COUNT; count++) {
        if (!get(isDestroyingManager)) {
            return Promise.resolve()
        }
        await sleep(CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL)
    }
    return Promise.reject()
}
