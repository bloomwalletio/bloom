import { getSelectedAccount } from '@core/account'
import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { convertBech32ToHexAddress } from '@core/wallet/utils/convertBech32ToHexAddress'
import { IAliasOutput } from '@iota/types'

export async function getSerialNumberFromAliasOutput(aliasAddress: string): Promise<number> {
    const account = getSelectedAccount()
    if (!account) {
        throw new Error('Account is undefined')
    }
    const aliasId = convertBech32ToHexAddress(aliasAddress)

    // TODO: add filter options if updated to @iota/wallet.rc-41
    const unspentOutputs = await account.unspentOutputs()

    const aliasOutput = unspentOutputs.find(({ output }) => {
        return output.type === OUTPUT_TYPE_ALIAS && output.aliasId === aliasId
    })

    // If it's the first state transition of the alias address, the aliasId is 0x0.
    // So we set the foundry counter to 0.
    const foundryCounter = aliasOutput ? (aliasOutput.output as IAliasOutput).foundryCounter : 0
    return foundryCounter + 1
}
