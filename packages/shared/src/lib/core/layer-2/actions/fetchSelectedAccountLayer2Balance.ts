import { IAccountState } from '@core/account'
import { calculateAndAddPersistedBalanceChange } from '@core/activity/actions'
import { ContractType, evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2'
import { IChain, getNetwork } from '@core/network'
import { getActiveProfile } from '@core/profile/stores'
import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { Converter } from '@core/utils/convert'
import { getOrRequestAssetFromPersistedAssets } from '@core/wallet/actions'
import { addPersistedAsset } from '@core/wallet/stores'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import { setLayer2AccountBalanceForChain } from '../stores'

export function fetchSelectedAccountLayer2Balance(account: IAccountState): void {
    const { evmAddresses, index } = account
    const chains = getNetwork()?.getChains() ?? []
    chains.forEach(async (chain) => {
        const { coinType, chainId } = chain.getConfiguration()
        const evmAddress = evmAddresses?.[coinType]
        if (!evmAddress) {
            return
        }

        const balances = await getLayer2BalanceForAddress(evmAddress, chain)
        if (!balances) {
            return
        }

        const layer2Balance: { [tokenId: string]: number } = {}

        for (const { balance, tokenId } of balances) {
            const isNativeToken = Converter.hexToBytes(tokenId).length === TOKEN_ID_BYTE_LENGTH
            const isErc20TrackedToken = getActiveProfile()?.trackedTokens?.[chainId]?.includes(tokenId)
            if (isNativeToken || isErc20TrackedToken) {
                const asset = await getOrRequestAssetFromPersistedAssets(tokenId, chainId)
                if (asset) {
                    addPersistedAsset(asset)
                }
            }
            calculateAndAddPersistedBalanceChange(account.index, chainId, tokenId, balance)
            layer2Balance[tokenId] = balance
        }
        setLayer2AccountBalanceForChain(index, chainId, layer2Balance)
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
    const agentID = evmAddressToAgentID(evmAddress)
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
    const chainId = chain.getConfiguration().chainId
    const trackedTokens = getActiveProfile()?.trackedTokens?.[chainId] ?? []
    const erc20TokenBalances = []
    for (const erc20Address of trackedTokens) {
        try {
            const contract = chain?.getContract(ContractType.Erc20, erc20Address)
            const coinType = chain?.getConfiguration().coinType
            if (!contract || !coinType) {
                continue
            }
            const rawBalance = await contract.methods.balanceOf(evmAddress).call()
            erc20TokenBalances.push({ balance: rawBalance, tokenId: erc20Address })
        } catch (err) {
            const error = err?.message ?? err
            console.error(error)
        }
    }
    return erc20TokenBalances
}
