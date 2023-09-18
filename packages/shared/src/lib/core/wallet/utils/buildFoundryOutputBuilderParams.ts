import {
    ImmutableAliasAddressUnlockCondition,
    type FoundryOutputBuilderParams,
    type UnlockCondition,
    AliasAddress,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
} from '@iota/sdk/out/types'
import { getSerialNumberFromAliasOutput } from '@core/activity/utils/outputs/getSerialNumberFromAliasOutput'
import { api } from '@core/profile-manager'
import { IIrc30Metadata } from '@core/token/interfaces'
import { Converter } from '@core/utils'

export async function buildFoundryOutputBuilderParams(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<FoundryOutputBuilderParams> {
    const unlockConditions: UnlockCondition[] = [
        new ImmutableAliasAddressUnlockCondition(new AliasAddress(api.bech32ToHex(aliasId))),
    ]

    const tokenScheme = new SimpleTokenScheme(BigInt(circulatingSupply), BigInt(0), BigInt(totalSupply))

    const immutableFeatures: Feature[] = [new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))]

    const serialNumber = await getSerialNumberFromAliasOutput(aliasId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
