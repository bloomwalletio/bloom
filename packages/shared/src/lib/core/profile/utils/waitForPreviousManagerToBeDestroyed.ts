import { get } from 'svelte/store'
import { CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL, CHECK_PREVIOUS_MANAGER_IS_DESTROYED_TIMOUT } from '../constants'
import { isDestroyingManager } from '../stores'

export async function waitForPreviousManagerToBeDestroyed(): Promise<void> {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            if (!get(isDestroyingManager)) {
                clearInterval(intervalId)
                resolve()
            }
        }, CHECK_PREVIOUS_MANAGER_IS_DESTROYED_INTERVAL)

        setTimeout(() => {
            clearInterval(intervalId)
            reject()
        }, CHECK_PREVIOUS_MANAGER_IS_DESTROYED_TIMOUT)
    })
}
