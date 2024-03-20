import { get, Writable } from 'svelte/store'

import { IClientOptions } from '@iota/sdk/out/types'

import { ClientError, CLIENT_ERROR_REGEXES, IError } from '@core/error'
import { IProfileManager } from '@core/profile-manager'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { StrongholdMigrationRequiredError, UnableToRestoreBackupForProfileManagerError } from '../errors'

export async function restoreBackupByCopyingFile(
    importFilePath: string,
    storageDirectory: string,
    strongholdPassword: string,
    clientOptions: IClientOptions,
    manager: Writable<IProfileManager>
): Promise<void> {
    try {
        await copyStrongholdFileToProfileDirectory(storageDirectory, importFilePath)
        await get(manager)?.setStrongholdPassword(strongholdPassword)
        await get(manager)?.setClientOptions(clientOptions)
    } catch (err) {
        const error = (err as IError).error ?? ''
        if (CLIENT_ERROR_REGEXES[ClientError.MigrationRequired].test(error)) {
            throw new StrongholdMigrationRequiredError()
        } else if (CLIENT_ERROR_REGEXES[ClientError.InvalidStrongholdPassword].test(error)) {
            throw err
        } else {
            throw new UnableToRestoreBackupForProfileManagerError()
        }
    }
}
