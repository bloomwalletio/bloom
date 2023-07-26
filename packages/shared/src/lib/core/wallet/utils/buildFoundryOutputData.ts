import {
    SimpleTokenScheme,
    ImmutableAliasAddressUnlockCondition,
    AliasAddress,
    UnlockCondition,
    BuildFoundryOutputData,
    MetadataFeature,
} from '@iota/sdk/out/types'
import { IIrc30Metadata } from '../interfaces'
import { getSerialNumberFromAliasOutput } from '@core/wallet/utils/outputs/getSerialNumberFromAliasOutput'
import { Feature } from '@core/wallet/types'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<BuildFoundryOutputData> {
    const unlockConditions: UnlockCondition[] = [new ImmutableAliasAddressUnlockCondition(new AliasAddress(aliasId))]
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
