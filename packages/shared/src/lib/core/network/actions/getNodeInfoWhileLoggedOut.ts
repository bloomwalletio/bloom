import { getTemporaryProfileManagerStorageDirectory } from '@contexts/onboarding/helpers'
import { IProfileManager, api } from '@core/profile-manager'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import { TEST_COIN_TYPE } from '..'
import { Platform } from '@core/app/classes'
import { CoinType, IAuth, INodeInfoWrapper } from '@iota/sdk/out/types'

export async function getNodeInfoWhileLoggedOut(url: string, auth: IAuth): Promise<INodeInfoWrapper> {
    let storagePath: string | undefined
    let manager: IProfileManager | undefined
    let nodeInfoResponse: INodeInfoWrapper | undefined
    try {
        storagePath = await getTemporaryProfileManagerStorageDirectory()
        manager = await initialiseProfileManager(
            storagePath,
            TEST_COIN_TYPE as CoinType,
            { nodes: [{ url }] },
            { stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` } }
        )
        nodeInfoResponse = await api.getNodeInfo(manager?.id, url, auth)

        if (!nodeInfoResponse) {
            throw new Error('error.node.invalidNode')
        }

        return nodeInfoResponse
    } finally {
        await cleanupTemporaryProfile(manager, storagePath)
    }
}

async function cleanupTemporaryProfile(
    manager: IProfileManager | undefined,
    storagePath: string | undefined
): Promise<void> {
    if (manager) {
        api.deleteWallet(manager?.id)
        await manager.destroy()
    }
    if (storagePath) {
        await Platform.removeProfileFolder(storagePath)
    }
}
