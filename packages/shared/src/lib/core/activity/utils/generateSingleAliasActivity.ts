import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { ADDRESS_TYPE_ALIAS, EMPTY_HEX_ID } from '@core/wallet/constants'
import { convertHexAddressToBech32, hashOutputId } from '@core/wallet/utils'
import { IAliasOutput } from '@iota/types'
import { ActivityType } from '../enums'
import { AliasActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getGovernorAddressFromAliasOutput, getStateControllerAddressFromAliasOutput } from './helper'
import { BASE_TOKEN_ID } from '@core/token'

export async function generateSingleAliasActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<AliasActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
        ? Number(baseActivity.baseTokenTransfer?.rawAmount)
        : undefined
    baseActivity.baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: '0',
    }

    const { output, outputId } = generationParameters.wrappedOutput

    const governorAddress = getGovernorAddressFromAliasOutput(output as IAliasOutput)
    const stateControllerAddress = getStateControllerAddressFromAliasOutput(output as IAliasOutput)
    const aliasId = getAliasId(output as IAliasOutput, outputId)

    return {
        type: ActivityType.Alias,
        ...baseActivity,
        aliasId,
        governorAddress,
        stateControllerAddress,
        containsValue: true, // TODO: check if why we do this
    }
}

// TODO: move to utils
function getAliasId(output: IAliasOutput, outputId: string): string {
    const isNewAlias = output.aliasId === EMPTY_HEX_ID
    const aliasId = isNewAlias ? hashOutputId(outputId) : output.aliasId
    return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId)
}
