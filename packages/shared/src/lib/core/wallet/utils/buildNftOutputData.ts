import type { BuildNftOutputData } from '@iota/sdk'
import { Feature, AddressUnlockCondition, Ed25519Address, MetadataFeature } from '@iota/sdk'
import { Converter } from '@core/utils'
import { EMPTY_HEX_ID } from '../constants'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'
import { IIrc27Metadata } from '@core/nfts/interfaces'

export function buildNftOutputData(metadata: IIrc27Metadata, address: string): BuildNftOutputData {
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
