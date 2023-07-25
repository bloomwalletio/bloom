import { Balance } from '@iota/sdk'

import { getDepositAddress } from '@core/account/utils'
import {
    getActiveProfilePersistedEvmAddressesByAccountIndex,
    updateAccountPersistedDataOnActiveProfile,
} from '@core/profile/stores'

import { IAccount, IAccountState, IPersistedAccountData } from '../interfaces'

export async function buildAccountState(
    account: IAccount,
    accountPersistedData: IPersistedAccountData
): Promise<IAccountState> {
    let balances: Balance = {
        baseCoin: {
            total: BigInt(0),
            available: BigInt(0),
            votingPower: '0',
        },
        requiredStorageDeposit: {
            alias: BigInt(0),
            basic: BigInt(0),
            foundry: BigInt(0),
            nft: BigInt(0),
        },
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        aliases: [],
    }
    const accountIndex = account.getMetadata().index
    const evmAddresses = getActiveProfilePersistedEvmAddressesByAccountIndex(accountIndex)
    let depositAddress = accountPersistedData.depositAddress
    let votingPower = ''
    try {
        balances = await account.getBalance()
        votingPower = balances.baseCoin.votingPower

        if (!depositAddress) {
            depositAddress = await getDepositAddress(account)
            updateAccountPersistedDataOnActiveProfile(accountIndex, { depositAddress })
        }
    } catch (err) {
        console.error(err)
    }

    return {
        index: accountIndex,
        ...account,
        ...accountPersistedData,
        depositAddress,
        evmAddresses,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        isTransferring: false,
        votingPower,
    }
}
