import { INodeInfo } from '@iota/sdk/out/types'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
import { NetworkHealth } from '../enums'
import { INetworkStatus } from '../interfaces'
import { MILESTONE_NOT_FOUND } from '@core/network/constants'

/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo} nodeInfo
 * @returns {INetworkStatus}
 */
export function getNetworkStatusFromNodeInfo(nodeInfo: INodeInfo | undefined): INetworkStatus {
    if (!nodeInfo) {
        return {
            messagesPerSecond: 0,
            referencedRate: 0,
            health: NetworkHealth.Disconnected,
            currentMilestone: MILESTONE_NOT_FOUND,
        }
    }

    let health = NetworkHealth.Operational
    const timestamp = nodeInfo.status.latestMilestone.timestamp
    if (timestamp) {
        const timeSinceLastMsInMinutes =
            (Date.now() - timestamp * MILLISECONDS_PER_SECOND) / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

        if (timeSinceLastMsInMinutes < 2) {
            health = NetworkHealth.Operational
        } else if (timeSinceLastMsInMinutes < 5) {
            health = NetworkHealth.Degraded
        }
    }

    return {
        messagesPerSecond: nodeInfo.metrics.blocksPerSecond,
        referencedRate: nodeInfo.metrics.referencedRate,
        health,
        currentMilestone: nodeInfo.status.confirmedMilestone.index,
    }
}
