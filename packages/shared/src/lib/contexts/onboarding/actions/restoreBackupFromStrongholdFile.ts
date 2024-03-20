import { getStorageDirectoryOfProfile } from '@core/profile'
import { profileManager, restoreBackup } from '@core/profile-manager'
import { get } from 'svelte/store'
import { restoreBackupByCopyingFile } from '../helpers'
import { onboardingProfile } from '../stores'
import { getDefaultClientOptions } from '@core/network'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { id, importFilePath, clientOptions, network } = get(onboardingProfile) ?? {}
    if (!importFilePath || !network) {
        return
    }

    try {
        await restoreBackup(importFilePath, strongholdPassword, network.protocol.bech32Hrp)
    } catch (err) {
        const storageDirectory = await getStorageDirectoryOfProfile(String(id))
        await restoreBackupByCopyingFile(
            importFilePath,
            storageDirectory,
            strongholdPassword,
            clientOptions ?? getDefaultClientOptions(network.id),
            profileManager
        )
    }
}
