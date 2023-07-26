import { Output } from '@core/wallet/types'
import { INativeToken, OutputType } from '@iota/sdk'
import { buildFoundryId } from './getFoundryId'

export function getNativeTokenFromOutput(output: Output): INativeToken {
    if (output?.type === OutputType.Foundry) {
        return { id: buildFoundryId(output), amount: output.tokenScheme.mintedTokens }
    }
    return output?.nativeTokens?.[0]
}
