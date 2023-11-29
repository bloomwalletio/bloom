import { FoundryOutput, INativeToken, OutputType, SimpleTokenScheme } from '@iota/sdk/out/types'
import { Output } from '@core/wallet/'
import { buildFoundryId } from './getFoundryId'

export async function getNativeTokenFromOutput(output: Output): Promise<INativeToken | undefined> {
    if (output?.type === OutputType.Foundry) {
        const foundryOutput = output as FoundryOutput
        return {
            id: await buildFoundryId(foundryOutput),
            amount: (foundryOutput.tokenScheme as SimpleTokenScheme).mintedTokens,
        }
    }
    return output?.nativeTokens?.[0]
}
