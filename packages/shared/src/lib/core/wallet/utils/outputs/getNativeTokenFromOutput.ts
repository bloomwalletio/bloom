import type { INativeToken } from '@iota/sdk'
import { OutputType } from '@iota/sdk/out/types'
import { Output } from '@core/wallet/'
import { buildFoundryId } from './getFoundryId'

export function getNativeTokenFromOutput(output: Output): INativeToken {
    if (output?.type === OutputType.Foundry) {
        return { id: buildFoundryId(output), amount: output.tokenScheme.mintedTokens }
    }
    return output?.nativeTokens?.[0]
}
