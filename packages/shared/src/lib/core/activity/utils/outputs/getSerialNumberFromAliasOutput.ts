import { AliasOutput } from '@iota/sdk/out/types'
import { getSelectedAccount } from '@core/account/stores'
import { api } from '@core/profile-manager/api'

export async function getSerialNumberFromAliasOutput(aliasAddress: string): Promise<number> {
    const account = getSelectedAccount()
    if (!account) {
        throw new Error('Account is undefined')
    }
    const aliasId = api.bech32ToHex(aliasAddress)

    const [aliasOutput] = await account.unspentOutputs({ aliasIds: [aliasId] })

    // If it's the first state transition of the alias address, the aliasId is 0x0.
    // So we set the foundry counter to 0.
    const foundryCounter = aliasOutput ? (aliasOutput.output as AliasOutput).foundryCounter : 0
    return foundryCounter + 1
}
