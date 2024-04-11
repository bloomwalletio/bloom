import { NETWORK_STATUSES_POLL_INTERVAL } from '../constants'
import { updateChainStatuses } from './updateChainStatuses'

let pollInterval: number

export async function pollChainStatuses(): Promise<void> {
    await updateChainStatuses()
    pollInterval = window.setInterval(() => void updateChainStatuses(), NETWORK_STATUSES_POLL_INTERVAL)
}

export function clearChainStatusesPoll(): void {
    clearInterval(pollInterval)
}
