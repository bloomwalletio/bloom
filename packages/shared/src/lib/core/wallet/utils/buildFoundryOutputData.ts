import { FeatureTypes, TokenSchemeTypes } from '@iota/types'
import { BuildFoundryOutputData, UnlockConditionType } from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { ADDRESS_TYPE_ALIAS, FEATURE_TYPE_METADATA } from '../constants'
import { IIrc30Metadata } from '../interfaces'
import { convertBech32ToHexAddress } from './convertBech32ToHexAddress'
import { getSerialNumberFromAliasOutput } from '@core/wallet/utils/outputs/getSerialNumberFromAliasOutput'

export async function buildFoundryOutputData(
    totalSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Metadata,
    aliasId: string
): Promise<BuildFoundryOutputData> {
    const unlockConditions: UnlockConditionTypes[] = [
        {
            type: UnlockConditionType.ImmutableAliasAddress,
            address: {
                type: ADDRESS_TYPE_ALIAS,
                aliasId: convertBech32ToHexAddress(aliasId),
            },
        },
    ]
    const tokenScheme: TokenSchemeTypes = {
        type: 0,
        maximumSupply: Converter.decimalToHex(totalSupply),
        meltedTokens: Converter.decimalToHex(0),
        mintedTokens: Converter.decimalToHex(circulatingSupply),
    }

    const immutableFeatures: FeatureTypes[] = [
        {
            type: FEATURE_TYPE_METADATA,
            data: Converter.utf8ToHex(JSON.stringify(metadata)),
        },
    ]

    const serialNumber = await getSerialNumberFromAliasOutput(aliasId)

    return {
        serialNumber,
        tokenScheme,
        immutableFeatures,
        unlockConditions,
    }
}
