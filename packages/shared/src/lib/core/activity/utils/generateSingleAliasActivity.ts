import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { api } from '@core/profile-manager'
import { getNetworkHrp } from '@core/profile/actions'
import { BASE_TOKEN_ID } from '@core/token'
import { EMPTY_HEX_ID } from '@core/wallet/constants'
import { AliasOutput } from '@iota/sdk/out/types'
import { ActivityAction, ActivityType } from '../enums'
import { AliasActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getGovernorAddressFromAliasOutput, getStateControllerAddressFromAliasOutput } from './helper'

export async function generateSingleAliasActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<AliasActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const { output, outputId } = generationParameters.wrappedOutput

    if (generationParameters.action === ActivityAction.Mint) {
        baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
            ? Number(baseActivity.baseTokenTransfer?.rawAmount)
            : undefined
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: '0',
        }
    }

    const governorAddress = getGovernorAddressFromAliasOutput(output as AliasOutput)
    const stateControllerAddress = getStateControllerAddressFromAliasOutput(output as AliasOutput)
    const aliasId = getAliasId(output as AliasOutput, outputId)

    return {
        type: ActivityType.Alias,
        ...baseActivity,
        aliasId,
        governorAddress,
        stateControllerAddress,
        containsValue: true, // TODO: check if why we do this
    }
}

function getAliasId(output: AliasOutput, outputId: string): string {
    const isNewAlias = output.aliasId === EMPTY_HEX_ID
    const aliasId = isNewAlias ? api.computeAliasId(outputId) : output.aliasId
    return api.aliasIdToBech32(aliasId, getNetworkHrp())
}
