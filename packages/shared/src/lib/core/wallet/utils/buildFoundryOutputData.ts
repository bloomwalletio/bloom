import {
    ImmutableAliasAddressUnlockCondition,
    type FoundryOutputBuilderParams,
    type UnlockCondition,
    AliasAddress,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
} from '@iota/sdk/out/types'
import { api } from '@core/profile-manager'
import { getSerialNumberFromAliasOutput } from '@core/activity/utils/outputs/getSerialNumberFromAliasOutput'
import { IIrc30Metadata } from '@core/token/interfaces'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<FoundryOutputBuilderParams> {
    const unlockConditions: UnlockCondition[] = [
        new ImmutableAliasAddressUnlockCondition(new AliasAddress(api.bech32ToHex(aliasId))),
    ]

    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))

    const immutableFeatures: Feature[] = [new MetadataFeature(JSON.stringify(metadata))]

    const serialNumber = await getSerialNumberFromAliasOutput(aliasId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
