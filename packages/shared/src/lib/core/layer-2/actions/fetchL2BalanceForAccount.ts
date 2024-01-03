import { get } from 'svelte/store'
import { IAccountState } from '@core/account/interfaces'
import {
    calculateAndAddPersistedNftBalanceChange,
    calculateAndAddPersistedTokenBalanceChange,
} from '@core/activity/actions'
import { ContractType, ILayer2TokenBalance } from '@core/layer-2'
import { IChain } from '@core/network/interfaces'
import { getNetwork } from '@core/network/stores'
import { getNftsFromNftIds } from '@core/nfts/utils'
import {
    addNftsToDownloadQueue,
    addOrUpdateNftInAllAccountNfts,
    setNftInAllAccountNftsToUnspendable,
    updateErc721NftsOwnership,
} from '@core/nfts/actions'
import { selectedAccountNfts } from '@core/nfts/stores'
import { getActiveProfile } from '@core/profile/stores'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { Converter } from '@core/utils/convert'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { evmAddressToAgentId, getAgentBalanceParameters, getSmartContractHexName } from '../helpers'
import { setLayer2AccountBalanceForChain } from '../stores'
import { isTrackedTokenAddress } from '@core/wallet'
import { TokenTrackingStatus } from '@core/token'

export function fetchL2BalanceForAccount(account: IAccountState): void {
    const { evmAddresses, index } = account
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const { coinType, id: networkId } = chain.getConfiguration()
        const evmAddress = evmAddresses?.[coinType]
        if (!evmAddress) {
            return
        }

        await fetchLayer2Nfts(evmAddress, chain, account)
        updateErc721NftsOwnership(account)

        const balances = await getLayer2BalanceForAddress(evmAddress, chain)
        if (!balances) {
            return
        }

        const layer2Balance: { [tokenId: string]: bigint } = {}

        for (const { balance, tokenId } of balances) {
            const adjustedBalance = Number.isNaN(Number(balance)) ? BigInt(0) : balance
            const isNativeToken = Converter.hexToBytes(tokenId).length === TOKEN_ID_BYTE_LENGTH
            const isErc20TrackedToken = isTrackedTokenAddress(networkId, tokenId)
            if (isNativeToken || isErc20TrackedToken) {
                await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
            }
            await calculateAndAddPersistedTokenBalanceChange(account, networkId, tokenId, adjustedBalance)
            layer2Balance[tokenId] = adjustedBalance
        }
        setLayer2AccountBalanceForChain(index, networkId, layer2Balance)
    })
}

async function getLayer2BalanceForAddress(
    evmAddress: string,
    chain: IChain
): Promise<ILayer2TokenBalance[] | undefined> {
    const layer2BaseAndIrc30Balances = await getLayer2NativeTokenBalancesForAddress(evmAddress, chain)
    const erc20Balances = await getLayer2Erc20BalancesForAddress(evmAddress, chain)
    return [...layer2BaseAndIrc30Balances, ...erc20Balances]
}

async function getLayer2NativeTokenBalancesForAddress(
    evmAddress: string,
    chain: IChain
): Promise<ILayer2TokenBalance[]> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentId(evmAddress, chain.getConfiguration())
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nativeTokenResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: { key: string; value: string }[] }

        const nativeTokens = nativeTokenResult.items.map((item) => ({
            tokenId: item.key,
            balance: BigInt(item.value),
        }))

        return nativeTokens
    } catch (e) {
        return []
    }
}

async function getLayer2Erc20BalancesForAddress(evmAddress: string, chain: IChain): Promise<ILayer2TokenBalance[]> {
    const networkId = chain.getConfiguration().id
    const trackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? {}
    const erc20TokenBalances = []
    for (const [erc20Address, trackingStatus] of Object.entries(trackedTokens)) {
        try {
            if (trackingStatus === TokenTrackingStatus.Untracked) {
                continue
            }

            const contract = chain?.getContract(ContractType.Erc20, erc20Address)
            const coinType = chain?.getConfiguration().coinType
            if (!contract || !coinType) {
                continue
            }
            const rawBalance = await contract.methods.balanceOf(evmAddress).call()
            erc20TokenBalances.push({ balance: BigInt(rawBalance), tokenId: erc20Address })
        } catch (err) {
            const error = err?.message ?? err
            console.error(error)
        }
    }
    return erc20TokenBalances
}

async function fetchLayer2Nfts(evmAddress: string, chain: IChain, account: IAccountState): Promise<void> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('accountNFTs')
    const agentID = evmAddressToAgentId(evmAddress, chain.getConfiguration())
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nftResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: { key: string; value: string }[] }

        // the element with `key: "0x69"` just represents the length of the list, so it needs to be excluded
        const nftIds = nftResult.items.filter((item) => item.key !== '0x69').map((item) => item.value)

        const networkId = chain.getConfiguration().id
        const nftsForChain = get(selectedAccountNfts).filter((nft) => nft.networkId === networkId)

        const newNftIds = nftIds.filter((nftId) => !nftsForChain.some((nft) => nft.id === nftId))

        const nfts = await getNftsFromNftIds(newNftIds, networkId)
        addOrUpdateNftInAllAccountNfts(account.index, ...nfts)

        const unspendableNftIds: string[] = nftsForChain
            .filter((nft) => !nftIds.some((nftId) => nft.id === nftId))
            .map((nft) => nft.id)
        setNftInAllAccountNftsToUnspendable(account.index, ...unspendableNftIds)
        void addNftsToDownloadQueue(account.index, nfts)

        for (const nft of nfts) {
            calculateAndAddPersistedNftBalanceChange(account, networkId, nft.id, true)
        }
        for (const nftId of unspendableNftIds) {
            calculateAndAddPersistedNftBalanceChange(account, networkId, nftId, false)
        }
    } catch (err) {
        console.error(err)
    }
}
