import { getSecretManagerPath } from '@core/profile-manager'
import { Platform } from '@core/app/classes'

import { UnableToCopyStrongholdBackupFileError } from '../errors'

export async function copyStrongholdFileToProfileDirectory(
    profileDirectory: string,
    importFilePath: string
): Promise<void> {
    try {
        const secretManagerPath = getSecretManagerPath(profileDirectory)
        await Platform.copyFile(importFilePath, secretManagerPath)
    } catch (err) {
        console.error(err)
        throw new UnableToCopyStrongholdBackupFileError()
    }
}
