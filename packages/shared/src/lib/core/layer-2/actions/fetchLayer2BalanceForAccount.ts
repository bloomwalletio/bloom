import { IAccountState } from '@core/account'
import { calculateAndAddPersistedBalanceChange } from '@core/activity/actions'
import { ContractType } from '@core/layer-2'
import { IChain, getNetwork } from '@core/network'
import { getActiveProfile } from '@core/profile/stores'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { Converter } from '@core/utils/convert'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { evmAddressToAgentId, getAgentBalanceParameters, getSmartContractHexName } from '../helpers'
import { setLayer2AccountBalanceForChain } from '../stores'
import { getNftsFromNftIds } from '@core/nfts/utils'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts } from '@core/nfts/actions'
import { selectedAccountNfts } from '@core/nfts/stores'
import { get } from 'svelte/store'

export function fetchLayer2BalanceForAccount(account: IAccountState): void {
    const { evmAddresses, index } = account
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const { coinType, id: networkId } = chain.getConfiguration()
        const evmAddress = evmAddresses?.[coinType]
        if (!evmAddress) {
            return
        }

        await fetchLayer2Nfts(evmAddress, chain, account.index)

        const balances = await getLayer2BalanceForAddress(evmAddress, chain)
        if (!balances) {
            return
        }

        const layer2Balance: { [tokenId: string]: number } = {}

        for (const { balance, tokenId } of balances) {
            const adjustedBalance = Number.isNaN(balance) ? 0 : balance
            const isNativeToken = Converter.hexToBytes(tokenId).length === TOKEN_ID_BYTE_LENGTH
            const isErc20TrackedToken = getActiveProfile()?.trackedTokens?.[networkId]?.includes(tokenId)
            if (isNativeToken || isErc20TrackedToken) {
                await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
            }
            await calculateAndAddPersistedBalanceChange(account, networkId, tokenId, adjustedBalance)
            layer2Balance[tokenId] = adjustedBalance
        }
        setLayer2AccountBalanceForChain(index, networkId, layer2Balance)
    })
}

async function getLayer2BalanceForAddress(
    evmAddress: string,
    chain: IChain
): Promise<{ balance: number; tokenId: string }[] | undefined> {
    const layer2BaseAndIrc30Balances = await getLayer2NativeTokenBalancesForAddress(evmAddress, chain)
    const erc20Balances = await getLayer2Erc20BalancesForAddress(evmAddress, chain)
    return [...layer2BaseAndIrc30Balances, ...erc20Balances]
}

async function getLayer2NativeTokenBalancesForAddress(
    evmAddress: string,
    chain: IChain
): Promise<{ balance: number; tokenId: string }[]> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('balance')
    const agentID = evmAddressToAgentId(evmAddress, chain.getConfiguration())
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nativeTokenResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: { key: string; value: number }[] }

        const nativeTokens = nativeTokenResult.items.map((item) => ({
            tokenId: item.key,
            balance: Number(item.value),
        }))

        return nativeTokens
    } catch (e) {
        return []
    }
}

async function getLayer2Erc20BalancesForAddress(
    evmAddress: string,
    chain: IChain
): Promise<{ balance: number; tokenId: string }[]> {
    const networkId = chain.getConfiguration().id
    const trackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? []
    const erc20TokenBalances = []
    for (const erc20Address of trackedTokens) {
        try {
            const contract = chain?.getContract(ContractType.Erc20, erc20Address)
            const coinType = chain?.getConfiguration().coinType
            if (!contract || !coinType) {
                continue
            }
            const rawBalance = await contract.methods.balanceOf(evmAddress).call()
            erc20TokenBalances.push({ balance: Number(rawBalance), tokenId: erc20Address })
        } catch (err) {
            const error = err?.message ?? err
            console.error(error)
        }
    }
    return erc20TokenBalances
}

async function fetchLayer2Nfts(evmAddress: string, chain: IChain, accountIndex: number): Promise<void> {
    const accountsCoreContract = getSmartContractHexName('accounts')
    const getBalanceFunc = getSmartContractHexName('accountNFTs')
    const agentID = evmAddressToAgentId(evmAddress, chain.getConfiguration())
    const parameters = getAgentBalanceParameters(agentID)
    try {
        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const nftResult = (await contract.methods
            .callView(accountsCoreContract, getBalanceFunc, parameters)
            .call()) as { items: { key: string; value: string }[] }

        const nftIds = nftResult.items.filter((item) => item.value !== '0x04').map((item) => item.value)

        const networkId = chain.getConfiguration().id
        const newNftIds = nftIds.filter(
            (nftId) => !get(selectedAccountNfts).some((nft) => nft.id === nftId && nft.networkId === networkId)
        )

        const nfts = await getNftsFromNftIds(newNftIds, networkId)
        addOrUpdateNftInAllAccountNfts(accountIndex, ...nfts)
        void addNftsToDownloadQueue(accountIndex, nfts)
    } catch (err) {
        console.error(err)
    }
}
