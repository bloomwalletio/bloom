import type { Feature, NftOutputBuilderParams } from '@iota/sdk'
import { AddressUnlockCondition, Ed25519Address, MetadataFeature } from '@iota/sdk/out/types'
import { IIrc27Metadata } from '@core/nfts/interfaces'
import { Converter } from '@core/utils'
import { EMPTY_HEX_ID } from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'

export function buildNftOutputBuilderParams(metadata: IIrc27Metadata, address: string): NftOutputBuilderParams {
    const unlockConditions: AddressUnlockCondition[] = [
        new AddressUnlockCondition(new Ed25519Address(convertBech32ToHexAddress(address))),
    ]

    const immutableFeatures: Feature[] = [new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))]

    return {
        nftId: EMPTY_HEX_ID,
        immutableFeatures,
        unlockConditions,
    }
}
