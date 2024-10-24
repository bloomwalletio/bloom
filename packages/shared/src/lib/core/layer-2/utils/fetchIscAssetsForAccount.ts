import { IAccountState } from '@core/account'
import { calculateAndAddPersistedNftBalanceChange, calculateAndAddPersistedTokenBalanceChange } from '@core/activity'
import { IscCoreContracts } from '@core/isc/classes/isc-core-contracts.class'
import { IscMagicContracts } from '@core/isc/classes/isc-magic-contracts.class'
import { IscChain } from '@core/network'
import { Nft, getNftsFromNftIds, isIrc27Nft } from '@core/nfts'
import { addNftsToDownloadQueue } from '@core/nfts/actions'
import { addOrUpdateNftsForAccount, selectedAccountNfts, updateNftsForAccount } from '@core/nfts/stores'
import { BASE_TOKEN_ID, ITokenBalance } from '@core/token'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { PartialWithId } from '@core/utils'
import { get } from 'svelte/store'

export async function fetchIscAssetsForAccount(
    profileId: string,
    evmAddress: string,
    iscChain: IscChain,
    account: IAccountState
): Promise<ITokenBalance> {
    void fetchL2Irc27Nfts(profileId, evmAddress, iscChain, account)

    const networkId = iscChain.id
    const l2Balance = await getL2NativeTokenBalancesForAddress(evmAddress, iscChain)
    for (const [tokenId, balance] of Object.entries(l2Balance)) {
        const adjustedBalance = Number.isNaN(Number(balance)) ? BigInt(0) : balance
        if (tokenId !== BASE_TOKEN_ID) {
            await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
            calculateAndAddPersistedTokenBalanceChange(profileId, account, networkId, tokenId, adjustedBalance)
            l2Balance[tokenId] = adjustedBalance
        }
    }
    return l2Balance
}

async function getL2NativeTokenBalancesForAddress(evmAddress: string, iscChain: IscChain): Promise<ITokenBalance> {
    try {
        const coreContracts = new IscCoreContracts(iscChain)
        const balance = await coreContracts.accounts.getBalance(evmAddress)
        // Make sure that we remove the base token here as we get it from the evm provider in the correct format
        delete balance[BASE_TOKEN_ID]
        return balance
    } catch (e) {
        console.error(e)
        return {}
    }
}

async function fetchL2Irc27Nfts(
    profileId: string,
    evmAddress: string,
    iscChain: IscChain,
    account: IAccountState
): Promise<void> {
    try {
        const magicContracts = new IscMagicContracts(iscChain)
        const nftIds = await magicContracts.accounts.getL2Nfts(evmAddress)

        const networkId = iscChain.id
        const nftsForChain = get(selectedAccountNfts).filter((nft) => nft.networkId === networkId && isIrc27Nft(nft))

        const newNftIds = nftIds.filter((nftId) => !nftsForChain.some((nft) => nft.id === nftId))

        const nfts = await getNftsFromNftIds(newNftIds, networkId)
        addOrUpdateNftsForAccount(account.index, nfts)

        const unspendableNfts = nftsForChain
            .filter((nft) => !nftIds.some((nftId) => nft.id === nftId))
            .map((nft) => ({ id: nft.id, isSpendable: false }) as PartialWithId<Nft>)

        updateNftsForAccount(account.index, unspendableNfts)
        void addNftsToDownloadQueue(nfts)

        for (const nft of nfts) {
            calculateAndAddPersistedNftBalanceChange(profileId, account, networkId, nft.id, true)
        }
        for (const nft of unspendableNfts) {
            calculateAndAddPersistedNftBalanceChange(profileId, account, networkId, nft.id, false)
        }
    } catch (err) {
        console.error(err)
    }
}
