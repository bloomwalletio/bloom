import { NETWORK_STATUSES_POLL_INTERVAL } from '../constants'
import { updateEvmNetworkStatuses } from './updateEvmNetworkStatuses'

let pollInterval: number

export async function pollEvmNetworkStatuses(): Promise<void> {
    await updateEvmNetworkStatuses()
    pollInterval = window.setInterval(() => void updateEvmNetworkStatuses(), NETWORK_STATUSES_POLL_INTERVAL)
}

export function clearEvmNetworkStatusesPoll(): void {
    clearInterval(pollInterval)
}
