import { IAccountState } from '@core/account/interfaces'
import { Converter } from '@core/utils'

import { IIrc30Metadata } from '../interfaces'
import { getMetadataFromFoundryOutput } from './getMetadataFromFoundryOutput'
import { validateIrc30Metadata } from './validateIrc30Metadata'

export async function getIrc30MetadataFromFoundryOutput(
    tokenId: string,
    account: IAccountState
): Promise<IIrc30Metadata | undefined> {
    try {
        const foundry = await account?.getFoundryOutput(tokenId)
        const data = getMetadataFromFoundryOutput(foundry)
        if (data) {
            const metadata = JSON.parse(Converter.hexToUtf8(data))
            const isValid = validateIrc30Metadata(metadata)
            if (isValid) {
                return metadata
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    } catch (err) {
        return Promise.resolve(undefined)
    }
}
