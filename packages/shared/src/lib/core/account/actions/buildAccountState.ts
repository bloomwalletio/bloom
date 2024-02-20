import { Balance } from '@iota/sdk'

import { getDepositAddress } from '@core/account/utils/getDepositAddress'
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
    let otherAddresses: string[] = accountPersistedData.otherAddresses
    let votingPower = BigInt(0)
    try {
        balances = await account.getBalance()
        votingPower = BigInt(balances.baseCoin.votingPower)

        const addresses = await account.addresses()
        otherAddresses = addresses.map((address) => address.address)
        updateAccountPersistedDataOnActiveProfile(accountIndex, { otherAddresses })

        if (!depositAddress) {
            depositAddress = await getDepositAddress(account)
            const { address } = addresses.find((address) => address.internal === false && address.keyIndex === 0) ?? {}
            updateAccountPersistedDataOnActiveProfile(accountIndex, { depositAddress: address })
        }
    } catch (err) {
        console.error(err)
    }

    return {
        index: accountIndex,
        ...account,
        ...accountPersistedData,
        depositAddress,
        otherAddresses,
        evmAddresses,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        isTransferring: false,
        votingPower,
    }
}
