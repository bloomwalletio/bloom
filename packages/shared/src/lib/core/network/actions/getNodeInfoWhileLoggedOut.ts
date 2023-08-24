import { getTemporaryProfileManagerStorageDirectory } from '@contexts/onboarding/helpers'
import { IProfileManager, api } from '@core/profile-manager'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import { TEST_COIN_TYPE } from '..'
import { Platform } from '@core/app'
import { CoinType, NodeInfoWrapper } from '@iota/wallet'

export async function getNodeInfoWhileLoggedOut(url: string): Promise<NodeInfoWrapper> {
    let storagePath: string | undefined
    let manager: IProfileManager | undefined
    let nodeInfoResponse: NodeInfoWrapper | undefined
    try {
        storagePath = await getTemporaryProfileManagerStorageDirectory()
        manager = await initialiseProfileManager(
            storagePath,
            TEST_COIN_TYPE as CoinType,
            { nodes: [{ url }] },
            { stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` } }
        )
        nodeInfoResponse = await manager.getNodeInfo(url)
        return nodeInfoResponse
    } catch (error) {
        return Promise.reject(error)
    } finally {
        if (manager) {
            api.deleteAccountManager(manager?.id)
            await manager.destroy()
        }
        if (storagePath) {
            await Platform.removeProfileFolder(storagePath)
        }
    }
}
