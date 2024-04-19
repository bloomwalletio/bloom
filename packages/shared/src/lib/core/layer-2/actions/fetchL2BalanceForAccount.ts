import { get } from 'svelte/store'
import { IAccountState } from '@core/account/interfaces'
import {
    calculateAndAddPersistedNftBalanceChange,
    calculateAndAddPersistedTokenBalanceChange,
} from '@core/activity/actions'
import { ContractType, ILayer2TokenBalance } from '@core/layer-2'
import { IEvmNetwork } from '@core/network/interfaces'
import { getEvmNetworks } from '@core/network/stores'
import { getNftsFromNftIds, isIrc27Nft } from '@core/nfts/utils'
import {
    addNftsToDownloadQueue,
    updateAllAccountNftsForAccount,
    setNftInAllAccountNftsToUnspendable,
    updateErc721NftsOwnership,
} from '@core/nfts/actions'
import { selectedAccountNfts } from '@core/nfts/stores'
import { getActiveProfile } from '@core/profile/stores'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { Converter } from '@core/utils/convert'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { evmAddressToAgentId, getAgentBalanceParameters, getSmartContractHexName } from '../helpers'
import { setLayer2AccountBalanceForChain } from '../stores'
import { BASE_TOKEN_ID, TokenTrackingStatus } from '@core/token'
import features from '@features/features'
import { KeyValue } from '@ui/types'
import { IError } from '@core/error'
import { IscChain } from '@core/network'

export function fetchL2BalanceForAccount(profileId: string, account: IAccountState): void {
    const { evmAddresses, index } = account
    const evmNetworks = getEvmNetworks()
    evmNetworks.forEach(async (evmNetwork) => {
        const { coinType, id: networkId } = evmNetwork
        const evmAddress = evmAddresses?.[coinType]
        if (!evmAddress) {
            return
        }

        await fetchL2Irc27Nfts(profileId, evmAddress, evmNetwork, account)
        if (features.collectibles.erc721.enabled) {
            void updateErc721NftsOwnership(account)
        }

        const l2Balance: { [tokenId: string]: bigint } = {}

        const l2BaseAndIrc30Balances = await getL2NativeTokenBalancesForAddress(evmAddress, evmNetwork)
        const erc20Balances = await getErc20BalancesForAddress(evmAddress, evmNetwork)
        if (erc20Balances.length === 0 && l2BaseAndIrc30Balances.length === 0) {
            return
        }

        for (const { balance, tokenId } of l2BaseAndIrc30Balances) {
            const adjustedBalance = Number.isNaN(Number(balance)) ? BigInt(0) : balance
            if (tokenId !== BASE_TOKEN_ID) {
                await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
                calculateAndAddPersistedTokenBalanceChange(profileId, account, networkId, tokenId, adjustedBalance)
            }
            l2Balance[tokenId] = adjustedBalance
        }

        for (const { balance, tokenId } of erc20Balances) {
            await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
            l2Balance[tokenId] = Number.isNaN(Number(balance)) ? BigInt(0) : balance
        }
        setLayer2AccountBalanceForChain(index, networkId, l2Balance)
    })
}

async function getL2NativeTokenBalancesForAddress(
    evmAddress: string,
    iscChain: IEvmNetwork
): Promise<ILayer2TokenBalance[]> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentId(evmAddress, (iscChain as IscChain).aliasAddress)
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = iscChain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nativeTokenResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: KeyValue<string>[] }

        const nativeTokens =
            nativeTokenResult.items?.map((item) => ({
                tokenId: item.key,
                balance: Converter.bigIntLikeToBigInt(item.value),
            })) ?? []

        return nativeTokens
    } catch (e) {
        return []
    }
}

async function getErc20BalancesForAddress(evmAddress: string, evmNetwork: IEvmNetwork): Promise<ILayer2TokenBalance[]> {
    const networkId = evmNetwork.id
    const coinType = evmNetwork.coinType

    const trackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? {}
    const erc20TokenBalances: ILayer2TokenBalance[] = []
    for (const [erc20Address, trackingStatus] of Object.entries(trackedTokens)) {
        try {
            if (trackingStatus === TokenTrackingStatus.Untracked) {
                continue
            }

            const contract = evmNetwork?.getContract(ContractType.Erc20, erc20Address)
            if (!contract || !coinType) {
                continue
            }
            const rawBalance = await contract.methods.balanceOf(evmAddress).call()
            erc20TokenBalances.push({ balance: Converter.bigIntLikeToBigInt(rawBalance), tokenId: erc20Address })
        } catch (err) {
            const error = (err as IError)?.message ?? err
            console.error(error)
        }
    }
    return erc20TokenBalances
}

async function fetchL2Irc27Nfts(
    profileId: string,
    evmAddress: string,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<void> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('accountNFTs')
    const agentID = evmAddressToAgentId(evmAddress, (evmNetwork as IscChain).aliasAddress)
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = evmNetwork.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nftResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: KeyValue<string>[] }

        // the element with `key: "0x69"` just represents the length of the list, so it needs to be excluded
        const nftIds = nftResult.items.filter((item) => item.key !== '0x69').map((item) => item.value)

        const networkId = evmNetwork.id
        const nftsForChain = get(selectedAccountNfts).filter((nft) => nft.networkId === networkId && isIrc27Nft(nft))

        const newNftIds = nftIds.filter((nftId) => !nftsForChain.some((nft) => nft.id === nftId))

        const nfts = await getNftsFromNftIds(newNftIds, networkId)
        updateAllAccountNftsForAccount(account.index, ...nfts)

        const unspendableNftIds: string[] = nftsForChain
            .filter((nft) => !nftIds.some((nftId) => nft.id === nftId))
            .map((nft) => nft.id)
        setNftInAllAccountNftsToUnspendable(account.index, ...unspendableNftIds)
        void addNftsToDownloadQueue(nfts)

        for (const nft of nfts) {
            calculateAndAddPersistedNftBalanceChange(profileId, account, networkId, nft.id, true)
        }
        for (const nftId of unspendableNftIds) {
            calculateAndAddPersistedNftBalanceChange(profileId, account, networkId, nftId, false)
        }
    } catch (err) {
        console.error(err)
    }
}
