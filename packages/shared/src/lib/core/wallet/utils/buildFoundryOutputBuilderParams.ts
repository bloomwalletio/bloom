import {
    ImmutableAliasAddressUnlockCondition,
    type FoundryOutputBuilderParams,
    type UnlockCondition,
    AliasAddress,
    SimpleTokenScheme,
    MetadataFeature,
    Feature,
} from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { api } from '@core/profile-manager'
import { getSerialNumberFromAliasOutput } from '@core/activity/utils/outputs/getSerialNumberFromAliasOutput'
import { IIrc30Metadata } from '@core/token/interfaces'

export async function buildFoundryOutputBuilderParams(
    totalSupply: bigint,
    circulatingSupply: bigint,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<FoundryOutputBuilderParams> {
    const unlockConditions: UnlockCondition[] = [
        new ImmutableAliasAddressUnlockCondition(new AliasAddress(api.bech32ToHex(aliasId))),
    ]

    // @ts-expect-error: https://github.com/iotaledger/iota-sdk/issues/1839
    const tokenScheme = new SimpleTokenScheme(
        Converter.bigIntToHex(circulatingSupply),
        BigInt(0),
        Converter.bigIntToHex(totalSupply)
    )
    const immutableFeatures: Feature[] = [new MetadataFeature(Converter.utf8ToHex(JSON.stringify(metadata)))]

    const serialNumber = await getSerialNumberFromAliasOutput(aliasId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
